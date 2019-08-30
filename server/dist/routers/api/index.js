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
exports.ApiRouter.use("/counterparties", require("../api/counterparties").router);
exports.ApiRouter.use("/profiles", require("../api/profiles").router);
exports.ApiRouter.use("/login", require("../api/login").router);
exports.ApiRouter.use("/users", require("../api/users").router);
exports.ApiRouter.use("/codelists", require("../api/codelists").router);
/* PROFILE DATA */
exports.ApiRouter.use("/profiles/:profile/accounting", require("../api/profile-accounting").router);
exports.ApiRouter.use("/profiles/:profile/contracts", require("../api/profile-contracts").router);
exports.ApiRouter.use("/profiles/:profile/dashboard", require("../api/profile-dashboard").router);
exports.ApiRouter.use("/profiles/:profile/years", require("../api/profile-years").router);
exports.ApiRouter.use("/profiles/:profile/events", require("../api/profile-events").router);
exports.ApiRouter.use("/profiles/:profile/import", require("../api/profile-import").router);
exports.ApiRouter.use("/profiles/:profile/payments", require("../api/profile-payments").router);
exports.ApiRouter.use("/profiles/:profile/noticeboard", require("../api/profile-noticeboard").router);
/* OTHER REQUESTS TO /api AS 404 */
exports.ApiRouter.use("**", function (req, res) { return res.sendStatus(404); });
