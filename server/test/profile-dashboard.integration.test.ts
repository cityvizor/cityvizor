import knex, { Knex } from "knex";
import { types } from "pg";
import { Request, Response } from "express";
import knexConfig from "../src/config/knexfile";
import { PRECOMPUTED_ACCOUNTING_SUMMARIES_FEATURE } from "../src/feature-flags";
import { ProfileDashboardRouter } from "../src/routers/public/profile-dashboard";
import { rebuildAccountingSummaries } from "../src/worker/import/accounting-summaries";

jest.mock("../environment", () => ({ database: { client: "pg" } }));
jest.mock("../src/db", () => ({
  get db() {
    return mockDb;
  },
}));

let mockDb: Knex.Transaction;
const describeWithDatabase = process.env.TEST_DATABASE_URL
  ? describe
  : describe.skip;
const categories = [
  "culture",
  "government",
  "housing",
  "schools",
  "sports",
  "transportation",
];
interface DashboardRow {
  year: number;
  category: string;
  amount: number | null;
  budgetAmount: number | null;
}

describeWithDatabase("profile dashboard on PostgreSQL", () => {
  let connection: Knex;
  const numericParser = types.getTypeParser(1700, "text");

  beforeAll(async () => {
    connection = knex({
      ...knexConfig,
      connection: process.env.TEST_DATABASE_URL,
    });
    mockDb = await connection.transaction();
    types.setTypeParser(1700, "text", parseFloat);
    // Prázdná DB; migrace i fixtures se na konci vrátí zpět.
    for (const migration of [
      "20190910095305_initial_structure",
      "20190926163851_pending_accounting",
      "20260923090000_feature_flags",
      "20260924090000_financing_amounts",
      "20261004110000_accounting_summaries",
      "20261004120000_precomputed_accounting_summaries_feature_flag",
      "20261022090000_exclude_internal_transfers",
    ])
      await require(`../migrations/${migration}`).up(mockDb);

    await mockDb.raw(`
      INSERT INTO app.profiles (id, status) VALUES (1, 'visible'), (2, 'visible'), (3, 'hidden');
      INSERT INTO app.years (profile_id, year, hidden) VALUES
        (1, 2025, false), (1, 2026, false), (1, 2027, true),
        (2, 2026, false), (3, 2026, false);
      -- Položka 6110 odhalí záměnu skupin položek za paragrafy.
      INSERT INTO data.accounting (profile_id, year, paragraph, item, amount, type) VALUES
        (1, 2026, 2200, 6110, 10, 'SK'),
        (1, 2026, 3100, 5000, 20, 'SK'),
        (1, 2026, 3200, 5000, 30, 'SK'),
        (1, 2026, 3100, 5000, 60, 'ROZ'),
        (1, 2026, 3600, 5000, 40, 'SK'),
        (1, 2026, 3300, 5000, 50, 'SK'),
        (1, 2026, 3400, 5000, 0, 'SK'),
        (1, 2026, 6100, 5000, 60, 'SK'),
        (1, 2026, 9999, 5000, 1000, 'SK'),
        (1, 2027, 2200, 5000, 1000, 'SK'),
        (2, 2026, 2200, 5000, 1000, 'SK'),
        (3, 2026, 2200, 5000, 1000, 'SK');
    `);
    for (const { profileId, year } of await mockDb("app.years")) {
      await rebuildAccountingSummaries(mockDb, profileId, year);
    }
  }, 30000);

  afterAll(async () => {
    await mockDb?.rollback();
    await connection?.destroy();
    types.setTypeParser(1700, "text", numericParser);
  });

  async function dashboard(profileId = 1) {
    const send = jest.fn<void, [DashboardRow[]]>();
    const route = ProfileDashboardRouter.stack[0].route!;
    await route.stack[0].handle(
      { params: { profile: String(profileId) } } as unknown as Request,
      { send } as unknown as Response,
      jest.fn()
    );
    return send.mock.calls[0][0]
      .sort((a, b) => a.year - b.year || a.category.localeCompare(b.category))
      .map(row => [row.year, row.category, row.amount, row.budgetAmount]);
  }

  it.each([false, true])(
    "preserves totals, empty categories and visibility (summaries = %s)",
    async enabled => {
      await mockDb("app.feature_flags")
        .where({ name: PRECOMPUTED_ACCOUNTING_SUMMARIES_FEATURE })
        .update({ enabled });
      expect(await dashboard()).toEqual([
        ...categories.map(category => [2025, category, null, null]),
        [2026, "culture", 50, 0],
        [2026, "government", 60, 0],
        [2026, "housing", 40, 0],
        [2026, "schools", 50, 60],
        [2026, "sports", 0, 0],
        [2026, "transportation", 10, 0],
      ]);
      expect(await dashboard(2)).toEqual([
        ...categories
          .slice(0, -1)
          .map(category => [2026, category, null, null]),
        [2026, "transportation", 1000, 0],
      ]);
      expect(await dashboard(3)).toEqual([]);
      expect(await dashboard(999)).toEqual([]);
    }
  );
});
