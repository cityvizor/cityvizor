import path from "path";
import environment from "../../environment";
import { aclRoles } from "./roles";
import { serverConfig } from "./server";

export default {

  apiRoot: environment.apiRoot,

  acl: {
    roles: aclRoles,
  },

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
    runOnInit: false,
    jobDelay: 5
  },

  url: environment.url,

  server: serverConfig,

  static: {
    dir: environment.staticFiles,
    index: path.join(environment.staticFiles, "index.html")
  },

  storage: {
    tmp: path.resolve(environment.tmpDir),
    avatars: path.resolve(environment.storageDir, "avatars"),
    imports: path.resolve(environment.storageDir, "imports")
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

  eDesky: {
    url: "https://edesky.cz/api/v1/documents",
    api_key: environment.keys.edesky.api_key
  },

  avatarWhitelist: [
    process.env.CITYVIZOR_IMAGES_URL
  ]

}