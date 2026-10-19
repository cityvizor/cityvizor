const migration = require("../migrations/20261004120000_precomputed_accounting_summaries_feature_flag");

function mockKnex() {
  const query = {
    insert: jest.fn().mockReturnThis(),
    onConflict: jest.fn().mockReturnThis(),
    ignore: jest.fn().mockResolvedValue(undefined),
  };
  const knex = jest.fn(() => query);

  return { knex, query };
}

it("creates the precomputed summaries flag disabled", async () => {
  const { knex, query } = mockKnex();

  await migration.up(knex);

  expect(knex).toHaveBeenCalledWith("app.feature_flags");
  expect(query.insert).toHaveBeenCalledWith({
    name: "precomputed-accounting-summaries",
    enabled: false,
  });
  expect(query.onConflict).toHaveBeenCalledWith("name");
  expect(query.ignore).toHaveBeenCalled();
});
