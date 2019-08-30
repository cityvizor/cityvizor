"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var environment_1 = __importDefault(require("../environment"));
var roles_1 = require("./roles");
var server_1 = require("./server");
exports.default = {
    apiRoot: environment_1.default.apiRoot,
    acl: {
        roles: roles_1.aclRoles,
    },
    cors: {
        enabled: environment_1.default.cors,
        origin: environment_1.default.corsOrigin,
        methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
        exposedHeaders: ["Location"],
        allowedHeaders: ["Authorization", "Content-Type"]
    },
    cron: {
        cronTime: "00 00 07 * * *",
        runOnInit: false
    },
    database: environment_1.default.database,
    server: server_1.serverConfig,
    static: {
        dir: environment_1.default.staticFiles,
        index: path_1.default.join(environment_1.default.staticFiles, "index.html")
    },
    storage: {
        tmp: path_1.default.resolve(environment_1.default.tmpDir),
        avatars: path_1.default.resolve(environment_1.default.storageDir, "avatars")
    },
    jwt: {
        secret: environment_1.default.keys.jwt.secret,
        expiration: "1d",
        credentialsRequired: false,
        getToken: function (req) {
            if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
                return req.headers.authorization.split(' ')[1];
            }
            else if (req.cookies && req.cookies["access_token"]) {
                return req.cookies.access_token;
            }
            return null;
        },
        cookieName: "access_token",
        cookieMaxAge: 1000 * 60 * 60 * 24
    },
    eDesky: {
        url: "https://edesky.cz/api/v1/documents",
        api_key: environment_1.default.keys.edesky.api_key
    }
};
