"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
var api_1 = require("./api");
var search_1 = require("./search");
var static_1 = require("./static");
exports.router.use("/api", api_1.ApiRouter);
exports.router.use("/api/search", search_1.SearchRouter);
exports.router.use(static_1.StaticRouter);
