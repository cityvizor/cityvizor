const path = require("path");

module.exports = {

  storageDir: path.resolve(__dirname, "../../data"),
  tmpDir: path.resolve(__dirname, "../../data/tmp"),

  staticFiles: path.resolve(__dirname, "../../client/dist"),

  databaseUri: "mongodb://localhost/cityvizor",

  cors: true,

  keys: {
    edesky: { api_key: null },
    jwt: { secret: "secret" }
  }
};