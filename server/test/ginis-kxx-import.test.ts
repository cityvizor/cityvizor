import fs from "fs-extra";
import os from "os";
import path from "path";
import iconv from "iconv-lite";
import { db } from "../src/db";
import { AccountingRecord, PaymentRecord } from "../src/schema";
import { Import } from "../src/worker/import/import";
import { DatabaseWriter } from "../src/worker/import/db-writer";
import { importGinisKxx } from "../src/worker/import/ginis/importer";
import { importLogger } from "../src/worker/import/import-logger";
import { checkImportQueue } from "../src/worker/import/queue";
import { kxxSource as source } from "./helpers/kxx-source";

jest.mock("../src/db", () => ({ db: jest.fn() }));

describe("GINIS KXX importer and queue", () => {
  let dir: string;
  let options: Import.Options;
  let accounting: AccountingRecord[];
  let payments: PaymentRecord[];
  const deleteQuery = {
    where: jest.fn().mockReturnThis(),
    delete: jest.fn().mockResolvedValue(0),
  };
  const transaction = Object.assign(
    jest.fn((_table: string) => deleteQuery),
    {
      commit: jest.fn().mockResolvedValue(undefined),
      rollback: jest.fn().mockResolvedValue(undefined),
    }
  );

  async function write(name: string, text: string) {
    await fs.writeFile(
      path.join(dir, name),
      iconv.encode(text, "windows-1250")
    );
  }

  async function queuePair() {
    // Fronta přečte běžící job, čekající job a profil; DB výsledky jsou explicitní.
    const query = {
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      first: jest
        .fn()
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce({ ...options, id: 1, validity: "2026-08-31" })
        .mockResolvedValueOnce({ name: "Test", type: "municipality" }),
      update: jest.fn().mockResolvedValue(1),
    };
    (db as unknown as jest.Mock).mockReturnValue(query);
    Object.assign(db, {
      transaction: jest.fn().mockResolvedValue(transaction),
    });
    await checkImportQueue();
    return query.update.mock.calls[query.update.mock.calls.length - 1][0];
  }

  function expectNoChanges() {
    expect(transaction).not.toHaveBeenCalled();
    expect(DatabaseWriter.prototype.writeAccountings).not.toHaveBeenCalled();
    expect(DatabaseWriter.prototype.writePayments).not.toHaveBeenCalled();
  }

  beforeEach(async () => {
    jest.clearAllMocks();
    dir = await fs.mkdtemp(path.join(os.tmpdir(), "cityvizor-kxx-"));
    accounting = [];
    payments = [];
    importLogger.clear();
    options = {
      profileId: 45,
      year: 2026,
      importDir: dir,
      append: false,
      format: "ginis_kxx",
      profileType: "municipality",
      transaction: transaction as unknown as Import.Options["transaction"],
    };
    // Stejná hranice jako u InternetStream: skutečný writer, nahrazený pouze zápis.
    jest
      .spyOn(DatabaseWriter.prototype, "writeAccountings")
      .mockImplementation(async rows => {
        accounting.push(...rows);
      });
    jest
      .spyOn(DatabaseWriter.prototype, "writePayments")
      .mockImplementation(async rows => {
        payments.push(...rows);
      });
    await write("ucto_8  test hč.kxx", source(0));
    await write("rozp_8  test hč.kxx", source(2));
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    importLogger.clear();
    await fs.remove(dir);
  });

  it("imports the pair through the queue, replaces data once and retains one invoice", async () => {
    await write("ucto_8  test hč.kxx", source(18) + source(0));
    const job = await queuePair();
    expect(job).toMatchObject({
      status: "success",
      warningCount: 1,
      error: null,
    });
    expect(job.logs).toContain("IGNORED_RECORD_TYPE");
    expect(importLogger.getLogs()).toBe("");
    expect(transaction.commit).toHaveBeenCalledTimes(1);
    expect(transaction.rollback).not.toHaveBeenCalled();
    expect(transaction.mock.calls.map(([table]) => table)).toEqual([
      "data.payments",
      "data.accounting",
    ]);
    expect(deleteQuery.delete).toHaveBeenCalledTimes(2);
    expect(deleteQuery.where).toHaveBeenNthCalledWith(1, {
      profileId: 45,
      year: 2026,
    });
    expect(deleteQuery.where).toHaveBeenNthCalledWith(2, {
      profileId: 45,
      year: 2026,
    });
    expect(accounting.map(row => [row.type, row.amount])).toEqual([
      ["KDF", 28.2],
      ["ROZ", 28.2],
    ]);
    expect(payments).toHaveLength(1);
    expect(payments[0]).toMatchObject({
      amount: 28.2,
      description: "Bankovní služba",
    });
  });

  it("rejects a file without usable accounting before replacing data", async () => {
    await write("rozp_8  test hč.kxx", source(18));
    await expect(importGinisKxx(options)).rejects.toThrow(
      "does not contain any usable accounting records"
    );
    expectNoChanges();
  });

  it("rejects identical inputs before replacing data", async () => {
    await write("rozp_8  test hč.kxx", source(0));
    await expect(importGinisKxx(options)).rejects.toThrow(
      "must not be identical"
    );
    expectNoChanges();
  });

  it.each([
    ["rozp_8  test hč.kxx", source(2) + source(0)],
    ["ucto_8  test hč.kxx", source(0) + source(7)],
  ])(
    "rejects mixed roles in %s before replacing data",
    async (file, contents) => {
      await write(file, contents);
      await expect(importGinisKxx(options)).rejects.toThrow("wrong file role");
      expectNoChanges();
    }
  );

  it("rejects damaged invoice metadata without deleting invoices", async () => {
    await write("ucto_8  test hč.kxx", source(0).replace("G/#0001", "G/#xxxx"));
    const job = await queuePair();
    expect(job.status).toBe("error");
    expect(job.error).toContain("invalid metadata or comment line");
    expect(transaction.rollback).toHaveBeenCalledTimes(1);
    expect(transaction.commit).not.toHaveBeenCalled();
    expectNoChanges();
  });

  it("rejects different organizations between files before replacing data", async () => {
    await write("rozp_8  test hč.kxx", source(2, "12345678"));
    await expect(importGinisKxx(options)).rejects.toThrow(
      "different organization/unit"
    );
    expectNoChanges();
  });

  it("requests rollback of the queue job when a payment write fails", async () => {
    jest
      .mocked(DatabaseWriter.prototype.writePayments)
      .mockRejectedValueOnce(new Error("Payment write failed"));
    const job = await queuePair();
    expect(job).toMatchObject({
      status: "error",
      error: "Payment write failed",
    });
    expect(accounting).toHaveLength(1);
    expect(transaction.rollback).toHaveBeenCalledTimes(1);
    expect(transaction.commit).not.toHaveBeenCalled();
  });
});
