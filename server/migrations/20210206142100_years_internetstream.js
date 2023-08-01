exports.up = async function (knex) {
  return knex.schema.alterTable('app.years', table => {
    table.text('import_url').nullable();
    table.string('import_format', 20).nullable();
    table.bigInteger('import_period_minutes').nullable();
  });
};

exports.down = async function (knex) {
  return knex.schema.alterTable('app.years', table => {
    table
      .dropColumn('import_url')
      .dropColumn('import_format')
      .dropColumn('import_period_minutes');
  });
};
