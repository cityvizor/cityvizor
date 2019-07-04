const path = require("path");

module.exports = {

  port: 3000,
  host: "0.0.0.0",

  tmpDir: path.resolve(__dirname, "../../data/tmp"),

  staticFiles: path.resolve(__dirname, "../../client/dist"),

  databaseUri: "mongodb://localhost/cityvizor",

  cors: true,
  corsOrigin: "http://localhost:4200",

  keys: {
    edesky: { api_key: null },
    jwt: { secret: "secret" }
  }
};
