const migration = require("../migrations/20260924090000_financing_amounts");

function mockKnex() {
  const query = {
    insert: jest.fn().mockReturnThis(),
    onConflict: jest.fn().mockReturnThis(),
    ignore: jest.fn().mockResolvedValue(undefined),
    where: jest.fn().mockReturnThis(),
    delete: jest.fn().mockResolvedValue(undefined),
  };
  const knex = Object.assign(
    jest.fn(() => query),
    {
      schema: { raw: jest.fn().mockResolvedValue(undefined) },
    }
  );

  return { knex, query };
}

it("adds financing columns without changing legacy income classification", async () => {
  const { knex, query } = mockKnex();

  await migration.up(knex);

  const sql = knex.schema.raw.mock.calls[0][0] as string;
  expect(sql).toContain("(acc.item < 5000 OR acc.item >= 8000)");
  expect(sql).toContain("WHEN acc.item >= 8000");
  expect(sql).toContain("AS financing_amount");
  expect(sql).toContain("AS budget_financing_amount");
  expect(query.insert).toHaveBeenCalledWith({
    name: "dashboard-financing-toggle",
    enabled: false,
  });
});

it("removes the feature flag and financing columns on rollback", async () => {
  const { knex, query } = mockKnex();

  await migration.down(knex);

  expect(query.where).toHaveBeenCalledWith({
    name: "dashboard-financing-toggle",
  });
  expect(query.delete).toHaveBeenCalled();

  const sql = knex.schema.raw.mock.calls[0][0] as string;
  expect(sql).toContain("DROP VIEW public.accounting");
  expect(sql).not.toContain("AS financing_amount");
  expect(sql).not.toContain("AS budget_financing_amount");
});
