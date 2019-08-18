"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config = require("../config");
var knex_1 = __importDefault(require("knex"));
var change_case_1 = __importDefault(require("change-case"));
console.log("[DB] Connecting to " + config.database.user + "@" + config.database.database + "...");
// rather ineffective way of converting case for a finished row :(
// would be better before executing just for identifiers, but not possible currrently by knex
// https://github.com/tgriesser/knex/issues/2084
function convertRow2CamelCase(row) {
    return Object.entries(row).reduce(function (acc, cur) {
        acc[change_case_1.default.camelCase(cur[0])] = cur[1];
        return acc;
    }, {});
}
;
// fix parsing numeric fields, https://github.com/tgriesser/knex/issues/387
var types = require('pg').types;
types.setTypeParser(1700, 'text', parseFloat);
// Initialize knex.
exports.db = knex_1.default({
    client: config.database.client,
    connection: {
        host: config.database.host,
        user: config.database.user,
        database: config.database.database,
        password: config.database.password
    },
    // convert camelCase names to snake_case
    wrapIdentifier: function (value, origImpl, queryContext) { return origImpl(change_case_1.default.snakeCase(value)); },
    // convert snake_case names to camelCase
    postProcessResponse: function (result, queryContext) {
        if (Array.isArray(result)) {
            return result.map(function (row) { return convertRow2CamelCase(row); });
        }
        else {
            return convertRow2CamelCase(result);
        }
    }
});
var sortReg = /^(\-?)(.+)$/;
function sort2order(sort) {
    var sortItems = sort.split(",");
    return sortItems.map(function (item) {
        var match = sortReg.exec(item); // ["-date", "-", "date", index: 0, input: "-date", groups: undefined]
        return { column: match[2], order: match[1] === "-" ? "DESC" : "ASC" };
    });
}
exports.sort2order = sort2order;
