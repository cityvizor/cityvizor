"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var request = require('request');
var EventEmitter = require('events');
var fs = require("fs-extra");
var path = require("path");
var async = require("async");
var csvparse = require("csv-parse");
var Writable = require('stream').Writable;
var config = require("../../../config");
var headerNames = {
    type: ["type", "recordType", "MODUL", "DOKLAD_AGENDA"],
    paragraph: ["paragraph", "PARAGRAF"],
    item: ["item", "POLOZKA"],
    eventId: ["eventId", "event", "AKCE", "ORG"],
    eventName: ["event", "AKCE_NAZEV"],
    amount: ["amount", "CASTKA"],
    date: ["date", "DATUM", "DOKLAD_DATUM"],
    counterpartyId: ["counterpartyId", "SUBJEKT_IC"],
    counterpartyName: ["counterpartyName", "SUBJEKT_NAZEV"],
    description: ["description", "POZNAMKA"]
};
var eventHeaderNames = {
    "id": ["id", "eventId", "srcId", "AKCE", "ORG"],
    "name": ["name", "eventName", "AKCE_NAZEV"]
};
var ImportParser = /** @class */ (function (_super) {
    __extends(ImportParser, _super);
    function ImportParser(etl) {
        var _this = _super.call(this) || this;
        _this.etl = etl;
        _this.modified = false;
        _this.result = {};
        return _this;
    }
    ImportParser.prototype.parseImport = function (files) {
        return __awaiter(this, void 0, void 0, function () {
            var eventsFile, dataFile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!files.eventsFile) return [3 /*break*/, 2];
                        eventsFile = fs.createReadStream(files.eventsFile);
                        return [4 /*yield*/, this.parseEvents(eventsFile)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!files.dataFile) return [3 /*break*/, 4];
                        dataFile = fs.createReadStream(files.dataFile);
                        return [4 /*yield*/, this.parseData(dataFile)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ImportParser.prototype.parseData = function (dataFile) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var error = false;
                        var parser = csvparse({ delimiter: ",", columns: function (line) { return _this.parseHeader(line, headerNames); } });
                        parser.on("error", function (err) { return (error = true, reject(err)); });
                        parser.on("end", function () { return !error && resolve(); });
                        var reader = _this.createReader();
                        reader.on("error", function (err) { return (error = true, reject(err)); });
                        dataFile.pipe(parser).pipe(reader);
                    })];
            });
        });
    };
    ImportParser.prototype.parseEvents = function (eventsFile) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var error = false;
                        var parser = csvparse({ delimiter: _this.etl.delimiter, columns: function (line) { return _this.parseHeader(line, eventHeaderNames); } });
                        parser.on("error", function (err) { return (error = true, reject(err)); });
                        parser.on("end", function () { return !error && resolve(); });
                        var reader = _this.createEventsReader();
                        reader.on("error", function (err) { return (error = true, reject(err)); });
                        eventsFile.pipe(parser).pipe(reader);
                    })];
            });
        });
    };
    ImportParser.prototype.createReader = function () {
        var _this = this;
        var reader = new Writable({
            objectMode: true,
            write: function (line, enc, callback) {
                _this.readLine(line);
                callback();
            }
        });
        return reader;
    };
    ImportParser.prototype.readLine = function (record) {
        // emit balance
        var balance = ["type", "paragraph", "item", "eventId", "amount"].reduce(function (bal, key) { return (bal[key] = record[key], bal); }, {});
        this.emit("balance", balance);
        // emit payment
        if (balance.type === "KDF" || balance.type === "KOF") {
            var payment = ["type", "paragraph", "item", "eventId", "amount", "date", "counterpartyId", "counterpartyName", "description"].reduce(function (bal, key) { return (bal[key] = record[key], bal); }, {});
            this.emit("payment", payment);
        }
    };
    ImportParser.prototype.createEventsReader = function () {
        var _this = this;
        var reader = new Writable({
            objectMode: true,
            write: function (line, enc, callback) {
                _this.emit("event", { id: line.id, name: line.name });
                callback();
            }
        });
        return reader;
    };
    ImportParser.prototype.parseHeader = function (headerLine, names) {
        return headerLine.map(function (originalField) {
            // browser throught all the target fields if originalField is someones alias
            var matchedField = Object.keys(names).find(function (name) { return names[name].indexOf(originalField) >= 0; });
            // return matched or original field
            return matchedField || originalField;
        });
    };
    return ImportParser;
}(EventEmitter));
exports.ImportParser = ImportParser;
