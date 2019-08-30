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
var multer_1 = __importDefault(require("multer"));
var express_dynacl_1 = __importDefault(require("express-dynacl"));
var express_jsonschema_1 = __importDefault(require("express-jsonschema"));
var config_1 = __importDefault(require("../../config"));
var _1 = require(".");
var db_1 = require("../../db");
exports.ImportRouter = express_1.default.Router();
var importAccountingSchema = {
    body: {
        type: "object",
        properties: {
            "year": { type: "string" },
            "validity": { type: "string", format: "date" }
        },
        required: ["year"],
        additionalProperties: false
    }
};
var upload = multer_1.default({ dest: config_1.default.storage.tmp });
exports.ImportRouter.post("/:profile/accounting", upload.fields([{ name: "dataFile", maxCount: 1 }, { name: "zipFile", maxCount: 1 }, { name: "eventsFile", maxCount: 1 }, { name: "paymentsFile", maxCount: 1 }]), express_jsonschema_1.default.validate(importAccountingSchema), express_dynacl_1.default("profile-import", "write"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var validity, year, importer, importData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // When file missing throw error immediately
                if (!req.files || (!req.files["dataFile"] && !req.files["zipFile"]))
                    return [2 /*return*/, res.status(400).send("Missing data file or zip file")];
                if (isNaN(req.body.year))
                    return [2 /*return*/, res.status(400).send("Invalid year value")];
                validity = new Date(req.body.validity);
                if (!(validity instanceof Date) || isNaN(validity.getTime()))
                    return [2 /*return*/, res.status(400).send("Invalid validity date value")];
                return [4 /*yield*/, db_1.db("data.years")
                        .where({ profile: req.params.profile, year: req.body.year })
                        .first()];
            case 1:
                year = _a.sent();
                if (!!year) return [3 /*break*/, 3];
                return [4 /*yield*/, db_1.db("data.years").insert({ profileId: Number(req.params.profile), year: req.body.year, hidden: false }, ["id", "profile", "year"])];
            case 2:
                year = _a.sent();
                _a.label = 3;
            case 3:
                importer = new _1.Importer(year);
                importData = {
                    validity: validity,
                    userId: req.user ? req.user.id : null,
                    files: {
                        zipFile: req.files["zipFile"] ? req.files["zipFile"][0].path : null,
                        dataFile: req.files["dataFile"] ? req.files["dataFile"][0].path : null,
                        eventsFile: req.files["eventsFile"] ? req.files["eventsFile"][0].path : null,
                        paymentsFile: req.files["paymentsFile"] ? req.files["paymentsFile"][0].path : null
                    }
                };
                // TODO: add to qqueue instead of direct execution
                return [4 /*yield*/, importer.import(year, importData)];
            case 4:
                // TODO: add to qqueue instead of direct execution
                _a.sent();
                // response sent immediately, the import is in queue
                // TODO
                res.json({});
                return [2 /*return*/];
        }
    });
}); });
