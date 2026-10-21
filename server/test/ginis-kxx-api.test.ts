import express from "express";
import "express-async-errors";
import acl from "express-dynacl";
import { expressjwt, Params } from "express-jwt";
import jwt from "jsonwebtoken";
import fs from "fs-extra";
import http from "http";
import { AddressInfo } from "net";
import config from "../src/config";
import { db } from "../src/db";
import { ImportRecord } from "../src/schema/database/import";
import { aclRoles } from "../src/config/roles";
import { ErrorHandler } from "../src/middleware/error-handler";
import { ImportAccountingRouter } from "../src/routers/import/accounting";
jest.mock("../src/db", () => ({ db: jest.fn() }));
jest.mock("../src/config", () => ({
  __esModule: true,
  default: {
    storage: {
      tmp: `/tmp/cityvizor-kxx-api-${process.pid}/tmp`,
      imports: `/tmp/cityvizor-kxx-api-${process.pid}/imports`,
    },
    jwt: {
      secret: "cityvizor-test-secret",
      algorithms: ["HS256"],
      requestProperty: "user",
      credentialsRequired: false,
    },
  },
}));

interface Part {
  name: string;
  value: string;
  filename?: string;
}
const valid: Part[] = [
  { name: "year", value: "2026" },
  { name: "validity", value: "2026-08-31" },
  {
    name: "accounting",
    filename: "my-accounting.KXX",
    value: "accounting bytes",
  },
  { name: "budget", filename: "my-budget.kxx", value: "budget bytes" },
];

describe("GINIS KXX upload API", () => {
  // Pouze výsledky DB operací; žádné napodobování uložených dat nebo SQL.
  const query = {
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    first: jest.fn(),
    insert: jest.fn(),
  };
  const transaction = jest.fn(async callback => callback(db));
  let server: http.Server;
  let user:
    | {
        id: number;
        roles: string[];
        managedProfiles?: number[];
        tokenCode?: number;
      }
    | undefined;

  async function request(parts = valid) {
    const body = new FormData();
    for (const part of parts) {
      if (part.filename)
        body.append(part.name, new Blob([part.value]), part.filename);
      else body.append(part.name, part.value);
    }
    const port = (server.address() as AddressInfo).port;
    return fetch(`http://127.0.0.1:${port}/api/import/profiles/45/ginis-kxx`, {
      method: "POST",
      headers: user
        ? { Authorization: `Bearer ${jwt.sign(user, config.jwt.secret)}` }
        : {},
      body,
    });
  }

  async function expectCleanTmp() {
    // Úklid v finally může doběhnout až po přijetí HTTP odpovědi.
    for (let i = 0; i < 100; i++) {
      if ((await fs.readdir(config.storage.tmp)).length === 0) return;
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    expect(await fs.readdir(config.storage.tmp)).toEqual([]);
  }

  beforeAll(async () => {
    acl.config({ roles: aclRoles, defaultRole: "guest" });
    const app = express();
    app.use(expressjwt(config.jwt as Params));
    app.use("/api/import", ImportAccountingRouter);
    app.use(ErrorHandler);
    server = await new Promise((resolve, reject) => {
      const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
      listener.on("error", reject);
    });
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    query.first.mockReset();
    query.insert.mockReset();
    (db as unknown as jest.Mock).mockReturnValue(query);
    Object.assign(db, { transaction });
    await fs.emptyDir(config.storage.tmp);
    await fs.emptyDir(config.storage.imports);
    user = { id: 7, roles: ["admin"] };
  });

  afterAll(async () => {
    if (server) {
      server.closeIdleConnections();
      await new Promise<void>(resolve => server.close(() => resolve()));
    }
    await fs.remove(config.storage.tmp);
    await fs.remove(config.storage.imports);
  });

  it("stores the pair under canonical names and creates one replacement job", async () => {
    user = { id: 7, roles: ["importer"], managedProfiles: [45], tokenCode: 3 };
    query.first
      .mockResolvedValueOnce({ id: 45, tokenCode: 3 })
      .mockResolvedValueOnce(undefined)
      .mockImplementationOnce(async () => ({
        ...query.insert.mock.calls[1][0],
        id: 1,
      }));
    query.insert
      .mockResolvedValueOnce([{ profileId: 45, year: 2026 }])
      .mockResolvedValueOnce([{ id: 1 }]);
    const response = await request();
    expect(response.status).toBe(200);
    const result = (await response.json()) as ImportRecord;
    expect(result).toMatchObject({
      profileId: 45,
      year: 2026,
      userId: 7,
      format: "ginis_kxx",
      append: false,
      validity: "2026-08-31",
      status: "pending",
    });
    expect(transaction).toHaveBeenCalledTimes(1);
    expect(query.insert).toHaveBeenCalledTimes(2);
    expect(await fs.readdir(result.importDir)).toEqual([
      "rozp.kxx",
      "ucto.kxx",
    ]);
    expect(await fs.readFile(`${result.importDir}/ucto.kxx`, "utf8")).toBe(
      "accounting bytes"
    );
    expect(await fs.readFile(`${result.importDir}/rozp.kxx`, "utf8")).toBe(
      "budget bytes"
    );
    await expectCleanTmp();
  });

  it("rejects an incomplete pair without creating a job", async () => {
    expect(
      (await request(valid.filter(part => part.name !== "budget"))).status
    ).toBe(400);
    expect(query.insert).not.toHaveBeenCalled();
    await expectCleanTmp();
  });

  it.each([
    { name: "guest", user: undefined, status: 401 },
    {
      name: "another profile",
      user: { id: 7, roles: ["profile-admin"], managedProfiles: [46] },
      status: 401,
    },
    {
      name: "revoked importer token",
      user: { id: 7, roles: ["importer"], managedProfiles: [45], tokenCode: 2 },
      status: 403,
    },
  ])("rejects $name", async scenario => {
    user = scenario.user;
    query.first.mockResolvedValueOnce({ id: 45, tokenCode: 3 });
    expect((await request()).status).toBe(scenario.status);
    expect(query.insert).not.toHaveBeenCalled();
    await expectCleanTmp();
  });

  it("removes staged files when queue insertion fails", async () => {
    query.first.mockResolvedValueOnce(undefined);
    query.insert
      .mockResolvedValueOnce([{ profileId: 45, year: 2026 }])
      .mockRejectedValueOnce(new Error("Queue insert failed"));
    expect((await request()).status).toBe(500);
    expect(transaction).toHaveBeenCalledTimes(1);
    expect(await fs.readdir(config.storage.imports)).toEqual([]);
    await expectCleanTmp();
  });
});
