// @ts-check
const path = require("path");

const cityvizorPath = path.resolve(__dirname, "../../");

module.exports = {
  port: 3000,
  host: "::",

  url: "http://localhost:4200",

  apiRoot: "/api",

  tmpDir: path.resolve(cityvizorPath, "data/tmp"),
  storageDir: path.resolve(cityvizorPath, "app/data"),

  staticFiles: path.resolve(cityvizorPath, "client/dist"),

  database: {
    client: "pg",
    host: "db.cityvizor",
    user: "postgres",
    password: "pass",
    database: "cityvizor",
  },

  redis: {
    port: 6379,
    host: "redis.cityvizor",
    // 10 minutes
    ttl: 600,
  },

  s3: {
    enabled: true,
    host: "minio.cityvizor",
    cdn_host: "http://localhost:9000",
    port: 9000,
    access_key: "minioadmin",
    secret_key: "minioadmin",
    use_ssl: true,
    private_bucket: "cityvizor",
    public_bucket: "cityvizor-public",
  },

  cors: true,
  corsOrigin: [
    "http://localhost:4200",
    "http://localhost:4202",
    "http://cityvizor.local:4200",
  ],

  keys: {
    edesky: { api_key: null },
    jwt: { secret: "secret" },
  },

  email: {
    address: "",
    smtp: "",
    port: "",
    user: "",
    password: "",
  },
};
