exports.up = async function (knex) {
  return knex.schema.alterTable('app.imports', table => {
    table
      .foreign(['profileId', 'year'])
      .references(['profileId', 'year'])
      .inTable('app.years')
      .onUpdate('cascade')
      .onDelete('cascade');
  });
};

exports.down = async function (knex) {
  return knex.schema.alterTable('app.imports', table => {
    table.dropForeign(['profileId', 'year']);
  });
};
