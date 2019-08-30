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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var express_jsonschema_1 = __importDefault(require("express-jsonschema"));
var express_dynacl_1 = __importDefault(require("express-dynacl"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.router = express_1.default.Router();
var config_1 = __importDefault(require("../config"));
var db_1 = require("../db");
function createToken(tokenData, validity) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenOptions;
        return __generator(this, function (_a) {
            tokenOptions = {
                expiresIn: validity
            };
            return [2 /*return*/, new Promise(function (resolve, reject) { return jsonwebtoken_1.default.sign(tokenData, config_1.default.jwt.secret, tokenOptions, function (err, token) { return err ? reject(err) : resolve(token); }); })];
        });
    });
}
var loginSchema = {
    type: "object",
    properties: {
        "login": { type: "string", required: true },
        "password": { type: "string", required: true }
    }
};
exports.router.post("/", express_jsonschema_1.default.validate({ body: loginSchema }), express_dynacl_1.default("login", "login"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var user, same, tokenData, _a, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, db_1.db("app.users")
                    .select("id", "login", "password")
                    .where({ login: req.body.login.toLowerCase() })
                    .first()];
            case 1:
                user = _b.sent();
                if (!user)
                    return [2 /*return*/, res.status(404).send("User not found")];
                return [4 /*yield*/, bcryptjs_1.default.compare(req.body.password, user.password)];
            case 2:
                same = _b.sent();
                if (!same) return [3 /*break*/, 6];
                _a = {
                    id: user.id,
                    login: user.login
                };
                return [4 /*yield*/, db_1.db("app.user_profiles").where({ userId: user.id }).then(function (rows) { return rows.map(function (row) { return row.profileId; }); })];
            case 3:
                _a.managedProfiles = _b.sent();
                return [4 /*yield*/, db_1.db("app.user_roles").where({ userId: user.id }).then(function (rows) { return rows.map(function (row) { return row.role; }); })];
            case 4:
                tokenData = (_a.roles = _b.sent(),
                    _a);
                return [4 /*yield*/, createToken(tokenData, "1 day")];
            case 5:
                token = _b.sent();
                res.send(token);
                return [3 /*break*/, 7];
            case 6:
                res.status(401).send("Wrong password for user \"" + user.id + "\".");
                _b.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); });
exports.router.get("/renew", express_dynacl_1.default("login", "renew"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var user, tokenData, _a, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, db_1.db("app.users")
                    .select("id", "login", "password")
                    .where({ id: req.body.login.toLowerCase() })
                    .first()];
            case 1:
                user = _b.sent();
                if (!user)
                    return [2 /*return*/, res.sendStatus(404)];
                _a = {
                    _id: user.id
                };
                return [4 /*yield*/, db_1.db("app.user_profiles").where({ userId: user.id }).then(function (rows) { return rows.map(function (row) { return row.profileId; }); })];
            case 2:
                _a.managedProfiles = _b.sent();
                return [4 /*yield*/, db_1.db("app.user_roles").where({ userId: user.id }).then(function (rows) { return rows.map(function (row) { return row.role; }); })];
            case 3:
                tokenData = (_a.roles = _b.sent(),
                    _a);
                return [4 /*yield*/, createToken(tokenData, "1 day")];
            case 4:
                token = _b.sent();
                res.send(token);
                return [2 /*return*/];
        }
    });
}); });
