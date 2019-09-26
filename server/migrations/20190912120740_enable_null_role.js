


exports.up = async function(knex) {
  return knex.schema
    .alterTable('app.users', table => {
      table.string('role').nullable().alter();
    });
}


exports.down = async function(knex) {
  return knex.schema
    .alterTable('app.users', table => {
      table.string('role').notNullable().alter();
    });
}

