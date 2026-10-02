exports.up = knex =>
  knex.schema.withSchema("app").createTable("feature_flags", table => {
    table.text("name").primary();
    table.boolean("enabled").notNullable().defaultTo(false);
  });

exports.down = knex => knex.schema.withSchema("app").dropTable("feature_flags");
