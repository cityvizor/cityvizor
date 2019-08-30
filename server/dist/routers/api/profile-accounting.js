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
var db_1 = require("../../db");
exports.router = express_1.default.Router({ mergeParams: true });
exports.router.get("/", express_dynacl_1.default("profile-accounting", "list"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var years;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db("accounting")
                    .select("year", "type").sum({ amount: "amount" })
                    .where({ profile_id: req.params.id })
                    .groupBy("year", "type")];
            case 1:
                years = _a.sent();
                if (years.length)
                    res.json(years);
                else
                    res.sendStatus(404);
                return [2 /*return*/];
        }
    });
}); });
exports.router.get("/:year", express_dynacl_1.default("profile-accounting", "read"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var accounting;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db("accounting")
                    .where({ profileId: req.params.profile, year: req.params.year })];
            case 1:
                accounting = _a.sent();
                res.json(accounting);
                return [2 /*return*/];
        }
    });
}); });
exports.router.get("/:year/groups/:field", express_dynacl_1.default("profile-accounting", "read"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var field, groups;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                field = req.params.field;
                if (["paragraph", "item"].indexOf(field) === -1)
                    return [2 /*return*/, res.status(400).send("Parameter field can only have values paragraph or item.")];
                return [4 /*yield*/, db_1.db("accounting")
                        .select(db_1.db.raw("SUBSTRING(" + field + "::varchar, 1, 2) AS id"))
                        .sum("incomeAmount as incomeAmount")
                        .sum("budgetIncomeAmount as budgetIncomeAmount")
                        .sum("expenditureAmount as expenditureAmount")
                        .sum("budgetExpenditureAmount as budgetExpenditureAmount")
                        .where({ profileId: req.params.profile, year: req.params.year })
                        .groupBy("id")];
            case 1:
                groups = _a.sent();
                res.json(groups);
                return [2 /*return*/];
        }
    });
}); });
exports.router.get("/:year/groups/:field/:group/events", express_dynacl_1.default("profile-accounting", "read"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var field, group, events, eventIndex, items, _i, items_1, row, item;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                field = req.params.field;
                group = req.params.group;
                if (["paragraph", "item"].indexOf(field) === -1)
                    return [2 /*return*/, res.status(400).send("Parameter field is mandatory and can only have values paragraph or item.")];
                return [4 /*yield*/, db_1.db("accounting AS a")
                        .leftJoin("events AS e", { "e.profileId": "a.profileId", "e.year": "a.year", "e.id": "a.event" })
                        .select("e.id AS id")
                        .max("e.name AS name")
                        .sum("a.incomeAmount as incomeAmount")
                        .sum("a.budgetIncomeAmount as budgetIncomeAmount")
                        .sum("a.expenditureAmount as expenditureAmount")
                        .sum("a.budgetExpenditureAmount as budgetExpenditureAmount")
                        .where({ "a.profileId": req.params.profile, "a.year": req.params.year })
                        .andWhereRaw("SUBSTRING(a." + field + "::varchar, 1, 2) = ?", [group])
                        .groupBy("id")];
            case 1:
                events = _a.sent();
                eventIndex = {};
                events.forEach(function (event) {
                    event.items = [];
                    eventIndex[event.id] = {
                        event: event,
                        itemIndex: {}
                    };
                });
                return [4 /*yield*/, db_1.db("accounting AS a")
                        .leftJoin("events AS e", { "e.profileId": "a.profileId", "e.year": "a.year", "e.id": "a.event" })
                        .select("e.id AS id", "item")
                        .sum("a.incomeAmount as incomeAmount")
                        .sum("a.budgetIncomeAmount as budgetIncomeAmount")
                        .sum("a.expenditureAmount as expenditureAmount")
                        .sum("a.budgetExpenditureAmount as budgetExpenditureAmount")
                        .where({ "a.profileId": req.params.profile, "a.year": req.params.year })
                        .andWhereRaw("SUBSTRING(a." + field + "::varchar, 1, 2) = ?", [group])
                        .groupBy("id", "item")];
            case 2:
                items = _a.sent();
                // assign item amounts to each event
                for (_i = 0, items_1 = items; _i < items_1.length; _i++) {
                    row = items_1[_i];
                    if (!eventIndex[row.id])
                        continue;
                    item = eventIndex[row.id].itemIndex[row.item];
                    if (!item) {
                        item = { id: row.item };
                        eventIndex[row.id].itemIndex[row.item] = item;
                        eventIndex[row.id].event.items.push(item);
                    }
                    item.incomeAmount = row.incomeAmount;
                    item.budgetIncomeAmount = row.budgetIncomeAmount;
                    item.expenditureAmount = row.expenditureAmount;
                    item.budgetExpenditureAmount = row.budgetExpenditureAmount;
                }
                res.json(events);
                return [2 /*return*/];
        }
    });
}); });
