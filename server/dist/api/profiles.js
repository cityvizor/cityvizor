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
var config_1 = __importDefault(require("../config"));
var multer_1 = __importDefault(require("multer"));
var express_dynacl_1 = __importDefault(require("express-dynacl"));
var db_1 = require("../db");
exports.router = express_1.default.Router();
var upload = multer_1.default({ dest: config_1.default.storage.tmp });
var profileSchema = {
    type: "object",
    properties: {
        "sort": { type: "string" },
        "fields": { type: "string" },
        "hidden": { type: "string" }
    }
};
exports.router.get("/", express_dynacl_1.default("profiles", "list"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var profiles, profiles;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.query.hidden) return [3 /*break*/, 2];
                return [4 /*yield*/, db_1.db("app.profiles").select("id", "hidden", "name", "url", "gpsX", "gpsY")];
            case 1:
                profiles = _a.sent();
                res.json(profiles);
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, db_1.db("profiles").select("id", "name", "url", "gpsX", "gpsY")];
            case 3:
                profiles = _a.sent();
                res.json(profiles);
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.router.get("/main", express_dynacl_1.default("profiles", "read"), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var profile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db("app.profiles")
                    .where({ main: true })
                    .first()];
            case 1:
                profile = _a.sent();
                if (!profile)
                    return [2 /*return*/, res.sendStatus(404)];
                res.json(profile);
                return [2 /*return*/];
        }
    });
}); });
exports.router.get("/:profile", express_dynacl_1.default("profiles", "read"), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var profile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db("app.profiles")
                    .modify(function () {
                    this.where({ url: String(req.params.profile) });
                    if (!isNaN(Number(req.params.profile)))
                        this.orWhere({ id: Number(req.params.profile) });
                })
                    .first()];
            case 1:
                profile = _a.sent();
                if (!profile)
                    return [2 /*return*/, res.sendStatus(404)];
                res.json(profile);
                return [2 /*return*/];
        }
    });
}); });
exports.router.post("/", express_dynacl_1.default("profiles", "write"), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db("app.profiles")
                    .insert(req.body, ["id"])
                    .then(function (result) { return result[0].id; })];
            case 1:
                id = _a.sent();
                res.location("/profiles/" + id);
                res.sendStatus(201);
                return [2 /*return*/];
        }
    });
}); });
exports.router.patch("/:profile", express_dynacl_1.default("profiles", "write"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db("app.profiles")
                    .where({ id: req.params.profile })
                    .update(req.body)];
            case 1:
                _a.sent();
                res.sendStatus(204);
                return [2 /*return*/];
        }
    });
}); });
exports.router.delete("/:profile", express_dynacl_1.default("profiles", "write"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db("app.profiles")
                    .where({ id: req.params.profile })
                    .delete()];
            case 1:
                _a.sent();
                res.sendStatus(204);
                return [2 /*return*/];
        }
    });
}); });
exports.router.get("/:profile/avatar", express_dynacl_1.default("profile-image", "read"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var profile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db("profiles")
                    .where({ id: req.params.profile })
                    .first()];
            case 1:
                profile = _a.sent();
                res.json(profile);
                return [2 /*return*/];
        }
    });
}); });
exports.router.put("/:profile/avatar", upload.single("avatar"), express_dynacl_1.default("profile-image", "write"), function (req, res, next) {
    /* TODO
  
    if (!req.file)
      return res.status(400).send("Missing file.");
    var allowedTypes = [".png", ".jpg", ".jpe", ".gif", ".svg"];
    var extname = path.extname(req.file.originalname).toLowerCase();
    if (allowedTypes.indexOf(extname) === -1)
      return res.status(400).send("Allowed file types are: " + allowedTypes.join(", "));
    var data = {
      avatar: {
        data: fs.readFileSync(req.file.path),
        mimeType: mime.lookup(req.file.originalname) || null,
        name: req.file.originalname
      }
    };
    Profile.findOneAndUpdate({ _id: req.params.profile }, data)
      .then(function (profile) { return res.sendStatus(200); })
      .catch(function (err) { return next(err); });
      */
});
exports.router.delete("/:profile/avatar", express_dynacl_1.default("profile-image", "write"), function (req, res, next) {
    /* TODO
   Profile.findOneAndUpdate({ _id: req.params.profile }, { avatar: null })
     .then(function (profile) { return res.sendStatus(200); })
     .catch(function (err) { return next(err); });
     */
});
