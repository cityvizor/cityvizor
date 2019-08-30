var config = require("../config");
var Agenda = require("agenda");
var agenda = new Agenda({ db: { address: config.database.uri, collection: "workerJobs" } });
