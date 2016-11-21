var express = require('express');
var app = express();

var path = require("path");

var router = express.Router();

router.use('/app', express.static("app"));
router.use('/assets', express.static("assets"));
router.use('/node_modules', express.static("node_modules"));

module.exports = router;