"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
exports.StaticRouter = express_1.default.Router();
var config = require("../config").default;
exports.StaticRouter.use(express_1.default.static(config.static.dir));
exports.StaticRouter.get("**", function (req, res) {
    res.sendFile(config.static.index);
});
