"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var express_1 = __importDefault(require("express"));
var config_1 = __importDefault(require("./config"));
function startServer() {
    return __awaiter(this, void 0, void 0, function () {
        var app, cors, compression, bodyParser, jwt, acl, aclOptions, _a, _b, _c, _d, host, port;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    app = express_1.default();
                    if (!config_1.default.cors.enabled) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("cors")); })];
                case 1:
                    cors = (_e.sent()).default;
                    app.use(cors(config_1.default.cors));
                    console.log("[SERVER] CORS enabled" + (config_1.default.cors.origin ? " for origin " + config_1.default.cors.origin : ""));
                    _e.label = 2;
                case 2: 
                // polyfill before express allows for async middleware
                return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('express-async-errors')); })];
                case 3:
                    // polyfill before express allows for async middleware
                    _e.sent();
                    if (!config_1.default.server.compression) return [3 /*break*/, 5];
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('compression')); })];
                case 4:
                    compression = _e.sent();
                    app.use(compression());
                    _e.label = 5;
                case 5: return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("body-parser")); })];
                case 6:
                    bodyParser = _e.sent();
                    app.use(bodyParser.json({})); // support json encoded bodies
                    app.use(bodyParser.urlencoded({
                        extended: true,
                        limit: "10000kb"
                    })); // support urlencoded bodies
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('express-jwt')); })];
                case 7:
                    jwt = (_e.sent()).default;
                    app.use(jwt(config_1.default.jwt), function (err, req, res, next) { return (err.code === 'invalid_token') ? next() : next(err); });
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("express-dynacl")); })];
                case 8:
                    acl = _e.sent();
                    aclOptions = {
                        roles: config_1.default.acl.roles,
                        defaultRoles: ["guest"],
                        userRoles: ["user"],
                        logConsole: true
                    };
                    acl.config(aclOptions);
                    /* ROUTING */
                    _b = (_a = app).use;
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("./routers")); })];
                case 9:
                    /* ROUTING */
                    _b.apply(_a, [(_e.sent()).router]);
                    // error handling
                    _d = (_c = app).use;
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("./middleware/error-handler")); })];
                case 10:
                    // error handling
                    _d.apply(_c, [(_e.sent()).errorHandler]);
                    host = config_1.default.server.host || "127.0.0.1";
                    port = config_1.default.server.port || 80;
                    http_1.default.createServer(app).listen(port, host, function () {
                        console.log('[SERVER] Listening on ' + host + ':' + port + '!');
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.startServer = startServer;
