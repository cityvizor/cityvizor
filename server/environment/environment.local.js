// @ts-check
const path = require("path");

const cityvizorPath = path.resolve(__dirname,"../../");

module.exports = {

  port: 3000,
  host: "127.0.0.1",

  url: "http://localhost:4200",

  apiRoot: "/api",

  tmpDir: path.resolve(cityvizorPath, "data/tmp"),
  storageDir: path.resolve(cityvizorPath, "data"),

  staticFiles: path.resolve(cityvizorPath, "client/dist"),

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
