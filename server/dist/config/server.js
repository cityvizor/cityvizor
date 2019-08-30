"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = __importDefault(require("../environment"));
exports.serverConfig = {
    host: environment_1.default.host,
    port: environment_1.default.port,
    compression: false
};
