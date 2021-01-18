// @ts-check
const path = require("path");

const cityvizorPath = path.resolve(__dirname,"../../");

module.exports = {

  port: 3000,
  host: "0.0.0.0",

  url: "http://localhost:4200",

  apiRoot: "/api",

  tmpDir: path.resolve(cityvizorPath, "data/tmp"),
  storageDir: path.resolve(cityvizorPath, "app/data"),

  staticFiles: path.resolve(cityvizorPath, "client/dist"),

  database: {
    client: 'pg',
    host: 'db.cityvizor.cesko.digital',
    user: 'postgres',
    password: 'pass',
    database: 'cityvizor'
  },

  cors: true,
  corsOrigin: ["http://localhost:4200", "http://localhost:4202"],

  keys: {
    edesky: { api_key: null },
    jwt: { secret: "secret" },
    productboard: {token: "CHANGEME"}
  },

  productboard: {
  }
};
