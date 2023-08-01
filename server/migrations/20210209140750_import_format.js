exports.up = async function (knex) {
  return knex.schema
    .createTable('app.import_formats', table => {
      table.string('format', 20).notNullable().unique();
    })
    .then(() => {
      return knex('app.import_formats').insert([
        {format: 'cityvizor'},
        {format: 'internetstream'},
      ]);
    })
    .then(() => {
      return knex.schema.alterTable('app.imports', table => {
        table
          .string('format', 20)
          .notNullable()
          .default('cityvizor')
          .references('format')
          .inTable('app.import_formats');
        table.string('importDir');
      });
    });
};

exports.down = async function (knex) {
  return knex.schema
    .alterTable('app.imports', table => {
      table.dropColumn('format').dropColumn('importDir');
    })
    .then(() => {
      knex.schema.dropTable('app.import_types');
    });
};
