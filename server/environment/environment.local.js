const path = require("path");

module.exports = {
  
  port: 4300,
  host: "localhost",

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