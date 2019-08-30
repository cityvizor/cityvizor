"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
exports.ApiRouter = express_1.default.Router();
// Handle and romalize standard query fields
exports.ApiRouter.use(function (req, res, next) {
    //normalize field list for mongoose from comma delimited to space delimited
    if (req.query.fields && typeof req.query.fields === "string")
        req.query.fields = req.query.fields.split(/[, ]/);
    // normalize page and limit to numbers
    if (req.query.page)
        req.query.page = Number(req.query.page);
    if (req.query.limit)
        req.query.limit = Number(req.query.limit);
    // continue
    next();
});
/* GENERAL API */
exports.ApiRouter.use(require("../api").router);
/* OTHER REQUESTS TO /api AS 404 */
exports.ApiRouter.use("**", function (req, res) { return res.sendStatus(404); });
