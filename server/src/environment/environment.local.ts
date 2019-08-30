const path = require("path");

module.exports = {

  port: 3000,
  host: "0.0.0.0",

  apiRoot: "/api",

  tmpDir: path.resolve(__dirname, "../../data/tmp"),
  storageDir: path.resolve(__dirname, "../../data"),

  staticFiles: path.resolve(__dirname, "../../client/dist"),

  database: {
    client: 'pg',
    host: '127.0.0.1',
    user: 'cityvizor',
    password: 'cityvizor',
    database: 'cityvizor'
  },

  cors: true,
  corsOrigin: "http://localhost:4200",

  keys: {
    edesky: { api_key: null },
    jwt: { secret: "secret" }
  }
};
