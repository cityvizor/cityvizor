"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
exports.SearchRouter = express_1.default.Router({ mergeParams: true });
var schema = require('express-jsonschema');
var acl = require("express-dynacl");
exports.SearchRouter.post("/counterparties", acl("payments", "list"), function (req, res, next) {
});
exports.SearchRouter.post("/payments", acl("payments", "list"), function (req, res, next) {
});
