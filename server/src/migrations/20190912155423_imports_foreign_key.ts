import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable("app.imports", table => {
    table.foreign(["profileId", "year"]).references(["profileId", "year"]).inTable("app.years").onUpdate("cascade").onDelete("cascade");
  })
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable("app.imports", table => {
    table.dropForeign(["profileId", "year"])
  });
}

