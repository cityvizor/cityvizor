import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
  return knex.schema
    .alterTable('app.users', table => {
      table.string('role').nullable().alter();
    });
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema
    .alterTable('app.users', table => {
      table.string('role').notNullable().alter();
    });
}

