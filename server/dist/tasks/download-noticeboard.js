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
var request = require('request-promise-native');
var cheerio = require("cheerio");
var Profile = require("../models/profile");
var NoticeBoard = require("../models/noticeboard");
var config = require("../../config");
// how many contracts per profile should be downloaded
var limit = 20;
module.exports = function () {
    return __awaiter(this, void 0, void 0, function () {
        var profiles, _a, _b, _i, i, err_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, Profile.find({})];
                case 1:
                    profiles = _c.sent();
                    console.log("Found " + profiles.length + " profiles to download documents for.");
                    _a = [];
                    for (_b in profiles)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    i = _a[_i];
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, downloadNoticeboards(profiles[i])];
                case 4:
                    _c.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _c.sent();
                    console.error("Couldn't download noticeboard for " + profiles[i].name + ": " + err_1.message);
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7: return [2 /*return*/];
            }
        });
    });
};
function downloadNoticeboards(profile) {
    return __awaiter(this, void 0, void 0, function () {
        var params, url, xml, $, noticeBoard;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("---");
                    console.log("Requesting download for profile " + profile.name);
                    // if no ID we can continue to next one
                    if (!profile.edesky) {
                        console.log("Variable profile.edesky empty, aborting.");
                        return [2 /*return*/];
                    }
                    params = {
                        "api_key": config.eDesky.api_key,
                        "dashboard_id": profile.edesky,
                        "order": "date",
                        "search_with": "sql",
                        "page": 1
                    };
                    url = config.eDesky.url + "?" + Object.keys(params).map(function (key) { return key + "=" + params[key]; }).join("&");
                    return [4 /*yield*/, request(url)];
                case 1:
                    xml = _a.sent();
                    $ = cheerio.load(xml);
                    noticeBoard = {
                        edesky: profile.edesky,
                        profile: profile.id,
                        documents: []
                    };
                    // assign values, create contracts' data
                    $("document").slice(0, 25).each(function (i, document) {
                        var nbDocument = {
                            profile: profile.id,
                            date: new Date($(document).attr("created_at")),
                            title: $(document).attr("name"),
                            category: $(document).attr("category"),
                            documentUrl: $(document).attr("orig_url"),
                            edeskyUrl: $(document).attr("edesky_url"),
                            previewUrl: $(document).attr("edesky_text_url"),
                            attachments: []
                        };
                        $(document).find("attachment").each(function (i, attachment) {
                            nbDocument.attachments.push({
                                name: $(attachment).attr("name"),
                                mime: $(attachment).attr("mime"),
                                url: $(attachment).attr("orig_url")
                            });
                        });
                        noticeBoard.documents.push(nbDocument);
                    });
                    return [4 /*yield*/, NoticeBoard.remove({ profile: profile.id })];
                case 2:
                    _a.sent();
                    // insert all the contracts to DB
                    return [4 /*yield*/, NoticeBoard.create(noticeBoard)];
                case 3:
                    // insert all the contracts to DB
                    _a.sent();
                    // update last update timestamp for contracts
                    profile.noticeboards.lastUpdate = new Date();
                    profile.markModified("noticeboards");
                    return [4 /*yield*/, profile.save()];
                case 4:
                    _a.sent();
                    console.log("Written " + noticeBoard.documents.length + " documents");
                    return [2 /*return*/];
            }
        });
    });
}
