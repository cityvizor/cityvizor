// @ts-check
const path = require("path");

const cityvizorPath = path.resolve(__dirname,"../../");

module.exports = {

  port: 3000,
  host: "::",

  url: process.env.URL,

  apiRoot: "/api",

  tmpDir: path.resolve(cityvizorPath, "data/tmp"),
  storageDir: path.resolve(cityvizorPath, "data"),

  staticFiles: path.resolve(cityvizorPath, "client/dist"),

  database: {
    client: 'pg',
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  },

  cors: true,
  corsOrigin: process.env.URL,

  keys: {
    edesky: { api_key: process.env.EDESKY_API_KEY },
    jwt: { secret: process.env.JWT_SECRET },
    productboard: {token: process.env.PRODUCTBOARD_TOKEN}
  },

};
