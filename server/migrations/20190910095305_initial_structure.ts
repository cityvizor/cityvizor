import * as Knex from "knex";

import path from "path";
import { readFile } from "fs-extra";

export async function up(knex: Knex): Promise<any> {
  const sql = (await readFile(path.join(__dirname, "20190910095305_initial_structure.sql"))).toString();
  return knex.raw(sql);
}


export async function down(knex: Knex): Promise<any> {
  return knex.raw(`
    DROP SCHEMA app CASCADE;
    DROP SCHEMA data CASCADE;
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
    GRANT ALL ON SCHEMA public TO postgres;
    GRANT ALL ON SCHEMA public TO public;
  `);
}

