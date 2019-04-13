const config = require("../config");

var mongoose = module.exports = require('mongoose');
mongoose.plugin(require('mongoose-write-stream'));
mongoose.plugin(require('mongoose-paginate'));
mongoose.Promise = global.Promise;

function connect() {

  console.log("[DB] Connecting to DB...");

  mongoose.connect(config.database.uri, { useNewUrlParser: true })
    .then(() => console.log("[DB] Connected to " + config.database.uri))
    .catch(err => {
      console.error("[DB] Error when connectiong to " + config.database.uri + ": " + err.message);
      console.error("[DB] Retrying in 10s...");
      setTimeout(() => connect(), config.database.reconnectTimeout);
    });
}

connect();

require("./models")
