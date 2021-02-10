import Knex from 'knex';

import path from 'path';

import environment from '../../environment';

import {snakeCase, camelCase} from 'change-case';

// rather ineffective way of converting case for a finished row :(
// would be better before executing just for identifiers, but not possible currrently by Knex
// https://github.com/tgriesser/knex/issues/2084
function convertRow2CamelCase(row: object): object {
  if (!row) return row;

  return Object.entries(row).reduce((acc, cur) => {
    acc[camelCase(cur[0])] = cur[1];
    return acc;
  }, {});
}

const knexConfig: Knex.Config = {
  client: environment.database.client,
  connection: {
    host: environment.database.host,
    port: environment.database.port,
    user: environment.database.user,
    password: environment.database.password,
    database: environment.database.database,
    ssl: environment.database.ssl
  },
  migrations: {
    // extension: 'ts',
    directory: path.resolve(__dirname, '../../migrations'),
  },

  pool: {
    min: 0, // discard the unused connections
  },

  debug: !!process.env.KNEX_DEBUG,

  wrapIdentifier: (value, origImpl) => origImpl(snakeCase(value)),

  // convert snake_case names to camelCase
  postProcessResponse: result => {
    if (Array.isArray(result)) {
      return result.map(row => convertRow2CamelCase(row));
    } else {
      return convertRow2CamelCase(result);
    }
  },
};

export = knexConfig;
