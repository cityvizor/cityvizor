const config = require("../config");

const { Pool } = require("pg");

const db = new Pool(config.database);

function connect() {

  console.log("[DB] Connecting to DB...");

  db.connect()
    .then(() => console.log(`[DB] Connected to ${config.database.user}@${config.database.database}`))
    .catch(err => {
      console.error(`[DB] Error when connectiong to ${config.database.user}@${config.database.database}: ${err.message}`);
      console.error("[DB] Retrying in 10s...");
      setTimeout(() => connect(), config.database.reconnectTimeout);
    });
}

module.exports = { db, connect };
