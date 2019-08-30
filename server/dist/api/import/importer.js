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
Object.defineProperty(exports, "__esModule", { value: true });
// remove when import of ZIP sorted out
var unzip = require("unzip");
var fs = require("fs-extra");
var path = require("path");
var config = require("../../config");
var ImportParser = require("./parser");
var ImportWriter = require("./writer");
var Importer = /** @class */ (function () {
    function Importer(options) {
        this.source = null;
        // collect warnings from all of the parts
        this.warnings = [];
        this.userId = options && options.userId || null;
        this.autoImport = options ? !!options.autoImport : false;
    }
    Importer.prototype.import = function (etl, options) {
        return __awaiter(this, void 0, void 0, function () {
            var parser, writer, err, importfiles, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // parse arguments
                        if (options && options.validity) {
                            this.validity = new Date(options.validity) || null;
                        }
                        parser = new ImportParser();
                        parser.on("warning", function (warning) { return _this.warnings.push(warning); });
                        writer = new ImportWriter(etl);
                        writer.on("warning", function (warning) { return _this.warnings.push(warning); });
                        parser.on("event", function (event) { return writer.writeEvent(event); });
                        //parser.on("counterparty", counterparty => writer.writeCounterparty(counterparty));
                        parser.on("balance", function (balance) { return writer.writeBalance(balance); });
                        parser.on("payment", function (payment) { return writer.writePayment(payment); });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, this.init(etl)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, writer.clear()];
                    case 3:
                        _a.sent();
                        importfiles = {};
                        if (!options.files.zipFile) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.extractZip(options.files.zipFile)];
                    case 4:
                        importfiles = _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        importfiles = options.files;
                        _a.label = 6;
                    case 6: return [4 /*yield*/, parser.parseImport(importfiles)];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        e_1 = _a.sent();
                        err = e_1;
                        console.error(e_1);
                        return [3 /*break*/, 9];
                    case 9: return [4 /*yield*/, this.logResults(etl, err)];
                    case 10:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Importer.prototype.init = function (etl) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        etl.status = "processing";
                        return [4 /*yield*/, etl.save()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Importer.prototype.extractZip = function (zipFile) {
        return __awaiter(this, void 0, void 0, function () {
            var unzipDir, e_2, csvFiles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        unzipDir = path.join(config.storage.tmp, "import-zip");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        // TODO: redo after testing with Gordic
                        // If zip file provided choose the largest CSV as dataFile and second largest as 
                        return [4 /*yield*/, fs.remove(unzipDir)];
                    case 2:
                        // TODO: redo after testing with Gordic
                        // If zip file provided choose the largest CSV as dataFile and second largest as 
                        _a.sent();
                        return [4 /*yield*/, fs.ensureDir(unzipDir)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                var stream = fs.createReadStream(zipFile).pipe(unzip.Extract({ path: unzipDir }));
                                stream.on("close", function () { return resolve(); });
                                stream.on("error", function (err) { return reject(err); });
                            })];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        e_2 = _a.sent();
                        throw new Error("Unable to extract ZIP file: " + e_2.message);
                    case 6: return [4 /*yield*/, fs.readdir(unzipDir)];
                    case 7:
                        csvFiles = (_a.sent())
                            .filter(function (file) { return file.match(/\.csv$/i); })
                            .map(function (file) {
                            var csvPath = path.join(unzipDir, file);
                            return {
                                path: csvPath,
                                size: fs.statSync(csvPath).size
                            };
                        });
                        csvFiles.sort(function (a, b) { return b.size - a.size; });
                        return [2 /*return*/, {
                                dataFile: csvFiles[0] ? csvFiles[0].path : null,
                                eventsFile: csvFiles[1] ? csvFiles[1].path : null
                            }];
                }
            });
        });
    };
    Importer.prototype.logResults = function (etl, err) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    return Importer;
}());
exports.Importer = Importer;
