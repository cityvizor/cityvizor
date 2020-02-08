// @ts-check
const path = require("path");

const cityvizorPath = path.resolve(__dirname,"../../");

module.exports = {

  port: 3000,
  host: "0.0.0.0",

  url: "http://localhost:4200",

  apiRoot: "/api",

  tmpDir: path.resolve(cityvizorPath, "data/tmp"),
  storageDir: path.resolve(cityvizorPath, "data"),

  staticFiles: path.resolve(cityvizorPath, "client/dist"),

  database: {
    client: 'pg',
    host: 'postgres',
    user: 'postgres',
    password: 'mysecretpassword',
    database: 'postgres'
  },

  cors: true,
  corsOrigin: "http://localhost:4200",

  keys: {
    edesky: { api_key: null },
    jwt: { secret: "secret" }
  }
};
