import path from "path";
import { AccountingRecord, PaymentRecord } from "../src/schema";
import { DatabaseWriter } from "../src/worker/import/db-writer";
import { Import } from "../src/worker/import/import";
import { importInternetStream } from "../src/worker/import/internetstream/importer";
import { importLogger } from "../src/worker/import/import-logger";

jest.mock("../src/db", () => ({ db: jest.fn() }));

function fixturePath(name: string): string {
  return path.join(__dirname, "fixtures", "import", "internetstream", name);
}

function createOptions(importDir: string): Import.Options {
  const deleteQuery = {
    where: jest.fn().mockReturnThis(),
    delete: jest.fn().mockResolvedValue(0),
  };
  const transaction = jest.fn(() => deleteQuery);

  return {
    profileId: 10,
    year: 2026,
    transaction: transaction as unknown as Import.Options["transaction"],
    importDir,
    append: false,
    format: "internetstream",
    profileType: "municipality",
  };
}

describe("InternetStream import", () => {
  let accountings: AccountingRecord[];
  let payments: PaymentRecord[];

  beforeEach(() => {
    accountings = [];
    payments = [];
    importLogger.clear();

    jest
      .spyOn(DatabaseWriter.prototype, "writeAccountings")
      .mockImplementation(async records => {
        accountings.push(...records);
      });
    jest
      .spyOn(DatabaseWriter.prototype, "writePayments")
      .mockImplementation(async records => {
        payments.push(...records);
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    importLogger.clear();
  });

  it("imports valid accounting and paymetn rows", async () => {
    const result = await importInternetStream(
      createOptions(fixturePath("valid"))
    );

    expect(result.warningCount).toBe(0);
    expect(accountings.map(record => record.type)).toEqual([
      "ROZ",
      "KDF",
      "KOF",
    ]);
    expect(accountings.map(record => record.amount)).toEqual([100, 200, 300]);
    expect(payments.map(record => record.amount)).toEqual([200, 300]);
  });

  it("skips amounts at the database limit", async () => {
    const result = await importInternetStream(
      createOptions(fixturePath("amount-limits"))
    );
    const logs = importLogger.getLogs();

    expect(result.warningCount).toBe(2);
    expect(accountings.map(record => record.amount)).toEqual([
      999999999999.99, 100,
    ]);
    expect(logs).toContain(
      "WARNING AMOUNT_OUT_OF_RANGE: RU.csv, row 3, document POSITIVE-LIMIT"
    );
    expect(logs).toContain(
      "WARNING AMOUNT_OUT_OF_RANGE: RU.csv, row 4, document NEGATIVE-LIMIT"
    );
  });

  it("skips invalid rows and reports their warning codes", async () => {
    const result = await importInternetStream(
      createOptions(fixturePath("invalid-rows"))
    );
    const logs = importLogger.getLogs();

    expect(result.warningCount).toBe(3);
    expect(accountings.map(record => record.amount)).toEqual([100, 200]);
    expect(payments.map(record => record.amount)).toEqual([200]);
    expect(logs).toContain("WARNING INVALID_NUMBER_FORMAT");
    expect(logs).toContain("WARNING INVALID_DATE_FORMAT");
    expect(logs).toContain("WARNING MISSING_REQUIRED_VALUE");
    expect(logs).toContain("Source rows: 5.");
    expect(logs).toContain("Accepted source rows: 2.");
    expect(logs).toContain("Skipped source rows: 3.");
  });

  it("fails when a file contains no usable rows", async () => {
    await expect(
      importInternetStream(createOptions(fixturePath("no-usable-rows")))
    ).rejects.toThrow("SK.csv does not contain any usable data rows.");
  });

  it("fails when SK.csv is missing a required column", async () => {
    await expect(
      importInternetStream(createOptions(fixturePath("missing-header")))
    ).rejects.toThrow("SK.csv is missing required columns: DOKLAD_AGENDA.");
  });
});
