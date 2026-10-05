import { Knex } from "knex";

import { rebuildAccountingSummaries } from "../src/worker/import/accounting-summaries";

describe("accounting summaries", () => {
  it("replaces both summaries in the supplied transaction", async () => {
    const deleteQuery = {
      where: jest.fn().mockReturnThis(),
      delete: jest.fn().mockResolvedValue(1),
    };
    const trx = Object.assign(jest.fn(() => deleteQuery), {
      raw: jest.fn().mockResolvedValue(undefined),
    }) as unknown as Knex.Transaction;

    await rebuildAccountingSummaries(trx, 12, 2026);

    expect(trx).toHaveBeenNthCalledWith(
      1,
      "data.accounting_group_summaries"
    );
    expect(trx).toHaveBeenNthCalledWith(
      2,
      "data.accounting_year_summaries"
    );
    expect(deleteQuery.where).toHaveBeenCalledTimes(2);
    expect(deleteQuery.where).toHaveBeenCalledWith({
      profileId: 12,
      year: 2026,
    });

    expect(trx.raw).toHaveBeenCalledTimes(3);
    expect(trx.raw).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining("INSERT INTO data.accounting_group_summaries"),
      ["paragraph", "paragraph", 12, 2026, "paragraph"]
    );
    expect(trx.raw).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("INSERT INTO data.accounting_group_summaries"),
      ["item", "item", 12, 2026, "item"]
    );
    expect(trx.raw).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining("INSERT INTO data.accounting_year_summaries"),
      [12, 2026, 12, 2026]
    );
  });

  it("keeps the public accounting amount boundaries and null-item expense", async () => {
    const deleteQuery = {
      where: jest.fn().mockReturnThis(),
      delete: jest.fn().mockResolvedValue(0),
    };
    const raw = jest.fn().mockResolvedValue(undefined);
    const trx = Object.assign(jest.fn(() => deleteQuery), {
      raw,
    }) as unknown as Knex.Transaction;

    await rebuildAccountingSummaries(trx, 1, 2025);

    const groupSql = raw.mock.calls[0][0] as string;
    expect(groupSql).toContain("item < 5000 OR item >= 8000");
    expect(groupSql).toContain("item >= 5000 AND item < 8000");
    expect(groupSql).toContain("paragraph IS NOT NULL AND item IS NULL");
    expect(groupSql).toContain("type <> 'ROZ'");
    expect(groupSql).toContain("type = 'ROZ'");
    expect(groupSql).toContain("item >= 8000 AND type <> 'ROZ'");
    expect(groupSql).toContain("item >= 8000 AND type = 'ROZ'");

    const yearSql = raw.mock.calls[2][0] as string;
    expect(yearSql).toContain("SUM(financing_amount)");
    expect(yearSql).toContain("SUM(budget_financing_amount)");
  });
});
