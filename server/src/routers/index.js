const express = require("express");
const router = module.exports = express.Router();

router.use("/api", require("./api"));

router.use("/api/search",require("./search"));

//router.use("/exports/v1", require("./exports-v1"));

router.use(require("./static"));