"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
exports.router.use("/counterparties", require("../api/counterparties").router);
exports.router.use("/profiles", require("../api/profiles").router);
exports.router.use("/login", require("../api/login").router);
exports.router.use("/users", require("../api/users").router);
exports.router.use("/codelists", require("../api/codelists").router);
/* PROFILE DATA */
exports.router.use("/profiles/:profile/accounting", require("../api/profile-accounting").router);
exports.router.use("/profiles/:profile/contracts", require("../api/profile-contracts").router);
exports.router.use("/profiles/:profile/dashboard", require("../api/profile-dashboard").router);
exports.router.use("/profiles/:profile/years", require("../api/profile-years").router);
exports.router.use("/profiles/:profile/events", require("../api/profile-events").router);
exports.router.use("/profiles/:profile/import", require("../api/profile-import").router);
exports.router.use("/profiles/:profile/payments", require("../api/profile-payments").router);
exports.router.use("/profiles/:profile/noticeboard", require("../api/profile-noticeboard").router);
