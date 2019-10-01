import Knex, { PoolConfig } from 'knex';

import path from "path";

import environment from "../../environment";

import changeCase from "change-case";

// rather ineffective way of converting case for a finished row :(
// would be better before executing just for identifiers, but not possible currrently by Knex
// https://github.com/tgriesser/knex/issues/2084
function convertRow2CamelCase(row: any): any {

  if (!row) return row;

  return Object.entries(row).reduce((acc, cur) => {
    acc[changeCase.camelCase(cur[0])] = cur[1];
    return acc;
  }, {});
};

const knexConfig: Knex.Config = {
  client: environment.database.client,
  connection: {
    host: environment.database.host,
    user: environment.database.user,
    password: environment.database.password,
    database: environment.database.database
  },
  migrations: {
    //extension: 'ts',
    directory: path.resolve(__dirname, "../../migrations")
  },

  debug: true,  

  wrapIdentifier: (value, origImpl, queryContext) => origImpl(changeCase.snakeCase(value)),

  // convert snake_case names to camelCase
  postProcessResponse: (result, queryContext) => {
    if (Array.isArray(result)) {
      return result.map(row => convertRow2CamelCase(row));
    } else {
      return convertRow2CamelCase(result);
    }
  }
};

export = knexConfig;