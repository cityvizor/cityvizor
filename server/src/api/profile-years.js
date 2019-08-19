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
var express_dynacl_1 = __importDefault(require("express-dynacl"));
var db_1 = require("../db");
exports.router = express_1.default.Router({ mergeParams: true });
exports.router.get("/", express_dynacl_1.default("profile-years", "list"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var years;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db("years as y")
                    .select("y.profileId", "y.year", "y.validity")
                    .sum("a.expenditureAmount as expenditureAmount")
                    .sum("a.budgetExpenditureAmount as budgetExpenditureAmount")
                    .sum("a.incomeAmount as incomeAmount")
                    .sum("a.budgetIncomeAmount as budgetIncomeAmount")
                    .leftJoin("accounting as a", { "a.profileId": "y.profileId", "a.year": "y.year" })
                    .where({ "y.profile_id": req.params.profile })
                    .groupBy("y.profileId", "y.year", "y.validity")];
            case 1:
                years = _a.sent();
                res.json(years);
                return [2 /*return*/];
        }
    });
}); });
exports.router.post("/", express_dynacl_1.default("profile-years", "write"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = { profile_id: req.params.profile, year: req.body.year };
                return [4 /*yield*/, db_1.db("data.years").insert(data)];
            case 1:
                _a.sent();
                res.sendStatus(201);
                return [2 /*return*/];
        }
    });
}); });
exports.router.get("/:year", express_dynacl_1.default("profile-years", "read"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var year;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db("years")
                    .where({ profile_id: req.params.profile, year: Number(req.params.year) })];
            case 1:
                year = _a.sent();
                res.json(year);
                return [2 /*return*/];
        }
    });
}); });
exports.router.patch("/:year", express_dynacl_1.default("profile-years", "write"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db("years")
                    .where({ profile_id: req.params.profile, year: Number(req.params.year) })
                    .update(req.body)];
            case 1:
                _a.sent();
                res.sendStatus(204);
                return [2 /*return*/];
        }
    });
}); });
exports.router.delete("/:etl", express_dynacl_1.default("profile-years", "write"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var yearId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                yearId = { profile_id: req.params.profile, year: Number(req.params.year) };
                // remove the data
                return [4 /*yield*/, db_1.db("accounting").where(yearId).delete()];
            case 1:
                // remove the data
                _a.sent();
                return [4 /*yield*/, db_1.db("payments").where(yearId).delete()];
            case 2:
                _a.sent();
                return [4 /*yield*/, db_1.db("events").where(yearId).delete()];
            case 3:
                _a.sent();
                if (!(req.query.type === "truncate")) return [3 /*break*/, 5];
                return [4 /*yield*/, db_1.db("years").where(yearId).update({ validity: null })];
            case 4:
                _a.sent();
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, db_1.db("years").where(yearId).delete()];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7:
                // success status
                res.sendStatus(204);
                return [2 /*return*/];
        }
    });
}); });
