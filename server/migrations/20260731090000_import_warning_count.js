exports.up = async function (knex) {
  return knex.schema.alterTable("app.imports", table => {
    table.integer("warning_count").notNullable().defaultTo(0);
  });
};

exports.down = async function (knex) {
  return knex.schema.alterTable("app.imports", table => {
    table.dropColumn("warning_count");
  });
};
