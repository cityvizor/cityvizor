import { Request, Response, Router } from "express";
import { db } from "../src/db";
import { ProfileAccountingRouter as Accounting } from "../src/routers/public/profile-accounting";
import { ProfileDashboardRouter as Dashboard } from "../src/routers/public/profile-dashboard";
import {
  EXCLUDE_INTERNAL_TRANSFERS_FEATURE as TRANSFERS,
  PRECOMPUTED_ACCOUNTING_SUMMARIES_FEATURE as SUMMARIES,
} from "../src/feature-flags";
import { rebuildAccountingSummaries } from "../src/worker/import/accounting-summaries";
import { ProfileYearsRouter as Years } from "../src/routers/public/profile-years";
import { AdminProfilesRouter as Admin } from "../src/routers/admin/profiles";

jest.mock("../src/db", () => {
  const { snakeCase, camelCase } = require("change-case");
  require("pg").types.setTypeParser(1700, "text", parseFloat);
  const convert = row =>
    row &&
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => [camelCase(key), value])
    );
  return {
    db: require("knex")({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
      pool: { min: 0 },
      wrapIdentifier: (value, original) => original(snakeCase(value)),
      postProcessResponse: result =>
        Array.isArray(result) ? result.map(convert) : convert(result),
    }),
  };
});
jest.mock("../src/config", () => ({
  url: "http://test",
  apiRoot: "/api",
  storage: { tmp: "/tmp" },
  s3: { enabled: false },
}));
const migration = require("../migrations/20261022090000_exclude_internal_transfers");
const profileMigration = require("../migrations/20261025090000_profile_internal_transfers");
const flag = (name: string, enabled: boolean) =>
  db("app.feature_flags").where({ name }).update({ enabled });
const profile = (id = 45) => db("app.profiles").where({ id });

// Invoke actual handlers/queries; ACL and HTTP serialization are outside this suite.
async function request(
  router: Router,
  path: string,
  params = {},
  query = {},
  method = "get",
  body = {}
) {
  const route = router.stack.find(
    layer =>
      layer.route?.path === path &&
      layer.route.stack.some(h => h.method === method)
  )!.route!;
  const res = {
    statusCode: 200,
    body: undefined as any,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(value: unknown) {
      this.body = value;
      return this;
    },
    send(value: unknown) {
      this.body = value;
      return this;
    },
    sendStatus(code: number) {
      return this.status(code);
    },
    location() {
      return this;
    },
  };
  await route.stack[route.stack.length - 1].handle(
    { params: { profile: "45", ...params }, query, body } as unknown as Request,
    res as unknown as Response,
    error => {
      throw error;
    }
  );
  return { status: res.statusCode, body: res.body };
}
const years = async (sumMode = "complete") =>
  (await request(Years, "/", {}, { sumMode })).body;
const save = (body: Record<string, unknown>, method = "patch", id = 45) =>
  request(
    Admin,
    method === "post" ? "/" : "/:profile",
    { profile: String(id) },
    {},
    method,
    method === "post" ? { id, status: "visible", ...body } : body
  );

const integration = process.env.TEST_DATABASE_URL ? describe : describe.skip;
integration("internal transfers on PostgreSQL", () => {
  beforeAll(async () => {
    const result = await db.raw("SELECT current_database() AS name");
    if (!result.rows[0].name.startsWith("cityvizor_internal_transfers_test_")) {
      throw new Error(
        "Use a disposable cityvizor_internal_transfers_test_* database."
      );
    }
    await db.raw(`
      CREATE SCHEMA app; CREATE SCHEMA data;
      CREATE TABLE app.profiles (
        id serial PRIMARY KEY, status text, type text,
        url text, name text, email text, avatar_type text, ico text, databox text,
        edesky integer, mapasamospravy integer, gps_x numeric, gps_y numeric,
        parent integer, popup_name text, sum_mode text DEFAULT 'complete',
        pbo_category_id integer, section_id integer
      );
      CREATE VIEW public.profiles AS SELECT
        id, status, url, name, email, avatar_type, ico, databox, edesky,
        mapasamospravy, gps_x, gps_y, type, parent, popup_name, sum_mode,
        pbo_category_id, section_id FROM app.profiles;
      CREATE TABLE app.years (
        profile_id integer, year integer, validity date, hidden boolean DEFAULT false,
        PRIMARY KEY (profile_id, year)
      );
      CREATE TABLE app.feature_flags (name text PRIMARY KEY, enabled boolean);
      CREATE TABLE data.accounting (
        profile_id integer, year integer, type text, paragraph integer, item integer,
        unit integer, event bigint, amount numeric(14,2)
      );
      CREATE VIEW public.years AS SELECT y.* FROM app.years y
        JOIN app.profiles p ON p.id = y.profile_id WHERE NOT y.hidden AND p.status = 'visible';
    `);
    await require("../migrations/20260924090000_financing_amounts").up(db);
    await require("../migrations/20261004110000_accounting_summaries").up(db);
    await db.raw(`
      INSERT INTO app.profiles (id, status, type) VALUES
        (45, 'visible', 'municipality'), (47, 'visible', 'pbo'), (48, 'visible', 'municipality');
      INSERT INTO app.years (profile_id, year) VALUES (45, 2026);
      INSERT INTO app.feature_flags VALUES ('precomputed-accounting-summaries', false);
      INSERT INTO data.accounting (profile_id, year, paragraph, item, type, amount)
      SELECT 45, 2026, 2210, item, type, amount
      FROM (VALUES (2111, 100, 300), (5169, 200, 400), (4134, 1000, 1200), (5345, 500, 700))
        AS v(item, actual, budget)
      CROSS JOIN LATERAL (VALUES ('UCT', actual), ('ROZ', budget)) AS a(type, amount);
    `);
    // Existing summaries from the previous worker, before transfer columns existed.
    await db.raw(`
      INSERT INTO data.accounting_year_summaries
        (profile_id, year, actual_income_amount, budget_income_amount, actual_expenditure_amount, budget_expenditure_amount)
      VALUES (45, 2026, 1100, 1500, 700, 1100);
      INSERT INTO data.accounting_group_summaries
        (profile_id, year, field, group_id, actual_income_amount, budget_income_amount, actual_expenditure_amount, budget_expenditure_amount)
      VALUES (45, 2026, 'paragraph', '22', 1100, 1500, 700, 1100),
        (45, 2026, 'item', '21', 100, 300, 0, 0), (45, 2026, 'item', '51', 0, 0, 200, 400),
        (45, 2026, 'item', '41', 1000, 1200, 0, 0), (45, 2026, 'item', '53', 0, 0, 500, 700);
    `);
    // Separate NULL-only years prevent other categories' ELSE 0 from masking SUM(NULL).
    await db.raw(`
      INSERT INTO app.years (profile_id, year, hidden) SELECT 48, year, true FROM generate_series(2019, 2022) AS year;
      INSERT INTO data.accounting (profile_id, year, paragraph, item, type, amount) VALUES
        (48, 2019, 6330, 4134, 'UCT', NULL), (48, 2020, 6330, 4134, 'ROZ', NULL),
        (48, 2021, 6330, 5345, 'UCT', NULL), (48, 2022, 6330, 5345, 'ROZ', NULL);
      INSERT INTO data.accounting_year_summaries (profile_id, year) SELECT 48, year FROM app.years WHERE profile_id = 48;
      INSERT INTO data.accounting_group_summaries (profile_id, year, field, group_id)
      SELECT profile_id, year, field, SUBSTRING((CASE field WHEN 'item' THEN item ELSE paragraph END)::varchar, 1, 2)
      FROM data.accounting CROSS JOIN (VALUES ('item'), ('paragraph')) AS f(field) WHERE profile_id = 48;
    `);
    await migration.up(db);
    await profileMigration.up(db);
  });

  afterAll(() => db.destroy());

  it("defaults to opt-out and backfills all four aggregates, including NULL-only groups", async () => {
    expect((await profile().first()).excludeInternalTransfers).toBe(false);
    expect(
      await db("app.feature_flags").where({ name: TRANSFERS }).first()
    ).toMatchObject({ enabled: false });
    expect(
      await db("data.accounting_year_summaries")
        .where({ profileId: 45 })
        .first()
    ).toMatchObject({
      actualInternalTransferIncomeAmount: 1000,
      budgetInternalTransferIncomeAmount: 1200,
      actualInternalTransferExpenditureAmount: 500,
      budgetInternalTransferExpenditureAmount: 700,
    });
    for (const [table, count] of [
      ["year", 4],
      ["group", 8],
    ] as const) {
      const rows = await db(`data.accounting_${table}_summaries`).where({
        profileId: 48,
      });
      expect(rows).toHaveLength(count);
      for (const row of rows)
        expect(row).toMatchObject({
          actualInternalTransferIncomeAmount: 0,
          budgetInternalTransferIncomeAmount: 0,
          actualInternalTransferExpenditureAmount: 0,
          budgetInternalTransferExpenditureAmount: 0,
        });
    }
  });

  it.each([
    [false, false],
    [false, true],
    [true, false],
    [true, true],
  ])(
    "keeps APIs consistent with feature=%s and profile=%s",
    async (enabled, optedIn) => {
      await flag(TRANSFERS, enabled);
      await profile().update({ excludeInternalTransfers: optedIn });
      const snapshots: unknown[] = [];
      for (const precomputed of [false, true]) {
        await flag(SUMMARIES, precomputed);
        const queries: string[] = [];
        const capture = query => queries.push(query.sql);
        db.on("query", capture);
        let data;
        try {
          data = await years();
        } finally {
          db.removeListener("query", capture);
        }
        expect(queries).toHaveLength(enabled ? 3 : 2);
        expect(data).toHaveLength(1);
        expect(data[0]).toMatchObject(
          enabled && optedIn
            ? {
                incomeAmount: 100,
                budgetIncomeAmount: 300,
                expenditureAmount: 200,
                budgetExpenditureAmount: 400,
              }
            : {
                incomeAmount: 1100,
                budgetIncomeAmount: 1500,
                expenditureAmount: 700,
                budgetExpenditureAmount: 1100,
              }
        );
        const groups = (
          await request(Accounting, "/:year/groups/:field", {
            year: "2026",
            field: "paragraph",
          })
        ).body;
        const dashboard = (await request(Dashboard, "/")).body;
        expect(groups).toHaveLength(1);
        expect(groups[0]).toMatchObject({
          expenditureAmount: data[0].expenditureAmount,
          budgetExpenditureAmount: data[0].budgetExpenditureAmount,
        });
        expect(
          dashboard.find(row => row.category === "transportation")
        ).toMatchObject({
          amount: data[0].expenditureAmount,
          budgetAmount: data[0].budgetExpenditureAmount,
        });
        snapshots.push({ data, groups, dashboard });
      }
      expect(snapshots[1]).toEqual(snapshots[0]);
    }
  );

  it.each(["post", "patch"])(
    "rejects alias bypasses/collisions and saves opt-in on %s",
    async method => {
      const id = method === "post" ? 49 : 45;
      const write = body => save(body, method, id);
      const before = await profile(id).first();
      const reject = async body => {
        expect((await write(body)).status).toBe(400);
        expect(await profile(id).first()).toEqual(before);
      };
      await flag(TRANSFERS, false);
      await reject({ type: "municipality", excludeInternalTransfers: true });
      await reject({
        type: "municipality",
        "exclude-internal-transfers": "true",
      });
      await flag(TRANSFERS, true);
      for (const body of [
        { Type: "pbo", ExcludeInternalTransfers: true },
        { Type: "municipality", "exclude-internal-transfers": "true" },
        { type: "municipality", Type: "pbo", excludeInternalTransfers: true },
        ...[true, false].map(value => ({
          type: "municipality",
          excludeInternalTransfers: true,
          "exclude-internal-transfers": value,
        })),
      ])
        await reject(body);
      if (method === "patch")
        expect(
          (await save({ ExcludeInternalTransfers: true }, "patch", 47)).status
        ).toBe(400);
      expect(
        (
          await write({
            Type: "municipality",
            "exclude-internal-transfers": true,
          })
        ).status
      ).toBe(method === "post" ? 201 : 204);
      expect((await profile(id).first()).excludeInternalTransfers).toBe(true);
    }
  );

  it("rebuilds transfer summaries even with the feature disabled", async () => {
    await flag(TRANSFERS, false);
    await db.transaction(trx => rebuildAccountingSummaries(trx, 45, 2026));
    expect(
      await db("data.accounting_year_summaries")
        .where({ profileId: 45 })
        .first()
    ).toMatchObject({
      actualInternalTransferIncomeAmount: 1000,
      budgetInternalTransferIncomeAmount: 1200,
      actualInternalTransferExpenditureAmount: 500,
      budgetInternalTransferExpenditureAmount: 700,
    });
  });
});
