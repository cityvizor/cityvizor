const path = require("path");

module.exports = {

  storageDir: path.resolve(__dirname, "../../data"),
  tmpDir: path.resolve(__dirname, "../../data/tmp"),

  staticFiles: path.resolve(__dirname, "../../client/dist"),

  databaseUri: "mongodb://localhost/cityvizor",

  cors: false,

  keys: {
    edesky: require("../../../cityvizor-keys/edesky"),
    jwt: require("../../../cityvizor-keys/jwt")
  }
};