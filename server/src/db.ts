import Knex from 'knex';

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

export const db = Knex(knexConfig)

export async function dbConnect() {
    return db.raw("SELECT 1+1 AS result")
}

export async function dbDestroy() {
    return db.destroy()
}

const sortReg = /^(-?)(.+)$/;

export function sort2order(sort: string): { column: string, order: "DESC" | "ASC" }[] {
    const sortItems = sort.split(",");
    return sortItems.map(item => {
        const match = sortReg.exec(item) // ["-date", "-", "date", index: 0, input: "-date", groups: undefined]
        return {column: match[2], order: match[1] === "-" ? "DESC" as "DESC" : "ASC" as "ASC"};
    });
}