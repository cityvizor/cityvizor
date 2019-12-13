import Knex from 'knex';
import Client from 'knex/lib/client';

import knexConfig from "./config/knexfile";

let connectionString: string;
if (typeof knexConfig.connection === "string") connectionString = knexConfig.connection;
else if ("user" in knexConfig.connection && "database" in knexConfig.connection) connectionString = knexConfig.connection.user + "@" + knexConfig.connection.database;
else if ("filename" in knexConfig.connection) connectionString = knexConfig.connection.filename;
else connectionString = "custom connection (see knexfile)";

console.log(`[DB] DB connection set to ${connectionString}`);

// fix parsing numeric fields, https://github.com/tgriesser/knex/issues/387
var types = require('pg').types;
types.setTypeParser(1700, 'text', parseFloat);

// hack because of postgre losing connections and Knex not being able to cope. sorry
const oldQuery = Client.prototype.query;

Client.prototype.validateConnection = function (connection) {
  return !connection.__knex__disposed;
};

Client.prototype.query = async function (connection, obj) {
  try {    
    return await oldQuery.call(this, connection, obj)
  }
  catch (err) {

    console.log("[DB] Query failed, reason: " + err.message);

    // kill previous connection (when acquiring from Pool tarn.js will ask for Knex validate function and that will filter out when __knex__disposed)
    connection.__knex__disposed = err;

    console.log("[DB] Trying one more time with another connection from pool.");

    // try one more time
    const secondConnection = await this.acquireConnection().disposer(function () {
      return this.releaseConnection(secondConnection);
    });

    return oldQuery.call(this, secondConnection, obj);
  }
};

// Initialize knex.
export const db = Knex(knexConfig);


(async function () {
  console.log("[DB] Running migrations");
  await db.migrate.latest(knexConfig.migrations);
  console.log("[DB] Migrations finished");
})();

export async function dbConnect() {
  return db.raw("SELECT 1+1 AS result")
}

export async function dbDestroy() {
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