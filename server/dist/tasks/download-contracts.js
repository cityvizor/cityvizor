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
Object.defineProperty(exports, "__esModule", { value: true });
var request_promise_native_1 = __importDefault(require("request-promise-native"));
var cheerio_1 = __importDefault(require("cheerio"));
var db_1 = require("../db");
var luxon_1 = require("luxon");
// how many contracts per profile should be downloaded
var limit = 20;
module.exports = function () {
    return __awaiter(this, void 0, void 0, function () {
        var profiles, _i, profiles_1, profile, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db("profiles")];
                case 1:
                    profiles = _a.sent();
                    console.log("Found " + profiles.length + " profiles to download contracts for.");
                    _i = 0, profiles_1 = profiles;
                    _a.label = 2;
                case 2:
                    if (!(_i < profiles_1.length)) return [3 /*break*/, 7];
                    profile = profiles_1[_i];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, downloadContracts(profile)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    console.error("Couldn't download contracts for " + profile.name + ": " + err_1.message);
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7: return [2 /*return*/];
            }
        });
    });
};
function downloadContracts(profile) {
    return __awaiter(this, void 0, void 0, function () {
        var url, html, $, contracts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("---");
                    console.log(profile.name);
                    if (!profile.ico) {
                        console.log("ICO not available, aborting.");
                        return [2 /*return*/];
                    }
                    url = "https://smlouvy.gov.cz/vyhledavani?searchResultList-limit=" + limit + "&do=searchResultList-setLimit&subject_idnum=" + profile.ico + "&all_versions=0";
                    return [4 /*yield*/, request_promise_native_1.default(url)];
                case 1:
                    html = _a.sent();
                    $ = cheerio_1.default.load(html);
                    contracts = [];
                    // assign values, create contracts' data
                    $("tr", "#snippet-searchResultList-list").each(function (i, row) {
                        if (i === 0)
                            return;
                        var items = $(row).children();
                        var amount = parseAmount(items.eq(4).text().trim());
                        var contract = {
                            "profileId": profile.id,
                            "title": items.eq(1).text().trim(),
                            "date": parseDate(items.eq(3).text().trim()),
                            "amount": amount[0],
                            "currency": amount[1],
                            "counterparty": items.eq(5).text().trim(),
                            "url": "https://smlouvy.gov.cz" + items.eq(6).find("a").attr("href")
                        };
                        contracts.push(contract);
                    });
                    return [4 /*yield*/, db_1.db("data.contracts")
                            .where({ profileId: profile.id })
                            .delete()];
                case 2:
                    _a.sent();
                    // insert all the contracts to DB
                    return [4 /*yield*/, db_1.db("data.contracts")
                            .insert(contracts)];
                case 3:
                    // insert all the contracts to DB
                    _a.sent();
                    console.log("Updated " + contracts.length + " contracts");
                    return [2 /*return*/];
            }
        });
    });
}
function parseAmount(string) {
    if (string.trim() === "Neuvedeno")
        return [null, null];
    var matches = string.match(/([\d ]+) ([A-Z]+)/);
    return [Number(matches[1].replace(/[^\d]/g, "")), matches[2]];
}
function parseDate(dateString) {
    var matches = dateString.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
    return luxon_1.DateTime.local(Number(matches[3]), Number(matches[2]), Number(matches[1])).toISODate();
}
