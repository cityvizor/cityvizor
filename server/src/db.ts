import Knex from 'knex';

import * as knexConfig from "./config/knexfile";

console.log(`[DB] DB set to ${(<any>knexConfig).connection.user}@${(<any>knexConfig).connection.database}`);

// fix parsing numeric fields, https://github.com/tgriesser/knex/issues/387
var types = require('pg').types;
types.setTypeParser(1700, 'text', parseFloat);

// Initialize knex.
export const db = Knex(knexConfig);

export async function dbConnect() {
  return db.raw("SELECT 1+1 AS result")
}

export async function dbDisconnect() {
  return db.destroy()
}

const sortReg = /^(\-?)(.+)$/;

export function sort2order(sort: string): { column: string, order: "DESC" | "ASC" }[] {
  const sortItems = sort.split(",");
  return sortItems.map(item => {
    const match = sortReg.exec(item) // ["-date", "-", "date", index: 0, input: "-date", groups: undefined]
    return { column: match[2], order: match[1] === "-" ? "DESC" as "DESC" : "ASC" as "ASC" };
  });
}