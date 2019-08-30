const config = require("./config").default;

import Knex from 'knex';

import changeCase from "change-case";

console.log(`[DB] Connecting to ${config.database.user}@${config.database.database}...`);

// rather ineffective way of converting case for a finished row :(
// would be better before executing just for identifiers, but not possible currrently by knex
// https://github.com/tgriesser/knex/issues/2084
function convertRow2CamelCase(row: any): any {
  
  if(!row) return row;
  
  return Object.entries(row).reduce((acc, cur) => {
    acc[changeCase.camelCase(cur[0])] = cur[1];
    return acc;
  }, {});
};

// fix parsing numeric fields, https://github.com/tgriesser/knex/issues/387
var types = require('pg').types
types.setTypeParser(1700, 'text', parseFloat);

// Initialize knex.
export const db = Knex({

  client: config.database.client,
  connection: {
    host: config.database.host,
    user: config.database.user,
    database: config.database.database,
    password: config.database.password
  },

  // convert camelCase names to snake_case
  wrapIdentifier: (value, origImpl, queryContext) => origImpl(changeCase.snakeCase(value)),

  // convert snake_case names to camelCase
  postProcessResponse: (result, queryContext) => {
    if (Array.isArray(result)) {
      return result.map(row => convertRow2CamelCase(row));
    } else {
      return convertRow2CamelCase(result);
    }
  }
});

const sortReg = /^(\-?)(.+)$/;

export function sort2order(sort: string): { column: string, order: "DESC" | "ASC" }[] {
  const sortItems = sort.split(",");
  return sortItems.map(item => {
    const match = sortReg.exec(item) // ["-date", "-", "date", index: 0, input: "-date", groups: undefined]
    return { column: match[2], order: match[1] === "-" ? "DESC" as "DESC" : "ASC" as "ASC" };
  });
}