exports.up = async function (knex) {
    return knex.schema.alterTable('app.import', table => {
      table.string('format', 20).notNullable().defaultTo('cityvizor')
      table.string('importDir')
    });
  };
  
  exports.down = async function (knex) {
    return knex.schema.alterTable('app.import', table => {
      table
        .dropColumn('format')
        .dropColumn('importDir')
    });
  };
  