const path = require("path");
const environment = require("../environment");

module.exports = {

  cors: {
    enabled: environment.cors,
    origin: environment.corsOrigin,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    exposedHeaders: ["Location"],
    allowedHeaders: ["Authorization", "Content-Type"]
  },

  cron: {
    cronTime: "00 00 07 * * *",
    runOnInit: false
  },

  database: {
    ...environment.database,
    reconnectTimeout: 10000
  },

  server: {
    host: environment.host,
    port: environment.port
  },

  static: {
    dir: environment.staticFiles,
    index: path.join(environment.staticFiles, "index.html")
  },

  storage: {
    tmp: path.resolve(environment.tmpDir)
  },

  jwt: {
    secret: environment.keys.jwt.secret,
    expiration: "1d",
    credentialsRequired: false,
    getToken: (req) => {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
      } else if (req.cookies && req.cookies["access_token"]) {
        return req.cookies.access_token;
      }
      return null;
    },
    cookieName: "access_token",
    cookieMaxAge: 1000 * 60 * 60 * 24
  },


};