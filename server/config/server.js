const path = require("path");
const environment = require("../environment");

module.exports = {

  cors: {
    enabled: environment.cors,
    origin: "http://localhost:4200",
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    exposedHeaders: ["Location"]
  },

  cron: {
    cronTime: "00 00 07 * * *",
    runOnInit: true
  },

  database: {
    uri: environment.databaseUri,
    reconnectTimeout: 10000
  },

  server: {
    host: environment.host,
    port: environment.port
  },

  static: {
    dir: environment.staticFiles,
    index: path.join(environment.staticFiles,"index.html")
  },

  storage: {
    data: path.resolve(environment.storageDir),
    tmp: path.resolve(environment.tmpDir)
  },

  jwt: {
    secret: environment.keys.jwt.secret,
    credentialsRequired: false
  },


};