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
var config_1 = __importDefault(require("../../config"));
var db_1 = require("../db");
exports.router = express_1.default.Router();
exports.router.get("/", express_dynacl_1.default("users", "list"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db("users").select("id", "login", "name", "email", "organization")];
            case 1:
                users = _a.sent();
                res.json(users);
                return [2 /*return*/];
        }
    });
}); });
exports.router.get("/:id", express_dynacl_1.default("users", "read"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db("users")
                    .select("id", "login", "name", "email", "organization")
                    .where({ id: req.params.user })
                    .first()];
            case 1:
                user = _a.sent();
                res.json(user);
                return [2 /*return*/];
        }
    });
}); });
var userPostSchema = {
    type: "object",
    properties: {
        "login": { type: "string" },
        "password": { type: "string" }
    }
};
exports.router.post("/", express_jsonschema_1.default.validate({ body: userPostSchema }), express_dynacl_1.default("users", "write"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var userData, _a, id;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userData = req.body;
                _a = userData;
                return [4 /*yield*/, bcryptjs_1.default.hash(userData.password, 10)];
            case 1:
                _a.password = _b.sent();
                return [4 /*yield*/, db_1.db("users").insert(userData, ["id"]).then(function (result) { return result[0].id; })];
            case 2:
                id = _b.sent();
                res.location = config_1.default.apiRoot + "/users/" + id;
                res.sendStatus(201);
                return [2 /*return*/];
        }
    });
}); });
exports.router.patch("/:user", express_dynacl_1.default("users", "write"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var userData, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userData = req.body;
                if (!userData.password) return [3 /*break*/, 2];
                _a = userData;
                return [4 /*yield*/, bcryptjs_1.default.hash(userData.password, 10)];
            case 1:
                _a.password = _b.sent();
                _b.label = 2;
            case 2: return [4 /*yield*/, db_1.db("users")
                    .where({ id: req.params.user })
                    .update(userData)];
            case 3:
                _b.sent();
                res.sendStatus(204);
                return [2 /*return*/];
        }
    });
}); });
exports.router.delete("/:user", express_dynacl_1.default("users", "delete"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db("users").where({ id: req.params.user }).delete()];
            case 1:
                _a.sent();
                res.sendStatus(204);
                return [2 /*return*/];
        }
    });
}); });
