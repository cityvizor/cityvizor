
const config = require("../config");

const Agenda = require("agenda");

const agenda = new Agenda({ db: { address: config.database.uri, collection: "workerJobs" } });