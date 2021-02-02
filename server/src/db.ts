/* tslint:disable:no-console */
import Knex from 'knex';

import knexConfig from './config/knexfile';
import {DateTime} from 'luxon';
import {types} from 'pg';
import {Query} from 'express-serve-static-core';

let connectionString: string;
if (typeof knexConfig.connection === 'string') {
  connectionString = knexConfig.connection;
} else if (
  Array.isArray(knexConfig.connection) &&
  'user' in knexConfig.connection &&
  'database' in knexConfig.connection
) {
  connectionString =
    knexConfig.connection.user + '@' + knexConfig.connection.database;
} else if (
  Array.isArray(knexConfig.connection) &&
  'filename' in knexConfig.connection
) {
  connectionString = knexConfig.connection.filename;
} else {
  connectionString = 'custom connection (see knexfile)';
}

console.log(`[DB] DB connection set to ${connectionString}`);

// fix parsing numeric fields, https://github.com/tgriesser/knex/issues/387
types.setTypeParser(1700, 'text', parseFloat);

export const db = Knex(knexConfig);

export async function dbConnect() {
  return db.raw('SELECT 1+1 AS result');
}

export async function dbDestroy() {
  return db.destroy();
}

const sortReg = /^(-?)(.+)$/;

export function sort2order(
  sort: string
): null | {column: string; order: string}[] {
  const sortItems = sort.split(',');
  return sortItems
    .map(item => {
      const match = sortReg.exec(item); // ["-date", "-", "date", index: 0, input: "-date", groups: undefined]
      if (!match || match.length < 3) {
        return {column: '', order: ''};
      }
      return {
        column: match[2],
        order: match[1] === '-' ? ('DESC' as const) : ('ASC' as const),
      };
    })
    .filter(item => {
      return item.column.length > 0 && item.order.length > 0;
    });
}

const validDateRegexp = /^(\d{4}-\d{2}-\d{2})$/;

export function isValidDateString(
  original: string | string[] | Query | Query[] | undefined
): boolean {
  if (typeof original === 'string') {
    return original.match(validDateRegexp) !== null;
  }
  // array is never valid date
  return false;
}

export function getValidDateString(
  original: string | string[] | Query | Query[] | undefined,
  returnNullOnInvalid = true
): string | null {
  if (typeof original === 'string') {
    if (original.match(validDateRegexp) !== null) {
      return original;
    }
  }
  if (returnNullOnInvalid) {
    return null;
  }
  return DateTime.local().toSQLDate();
}
