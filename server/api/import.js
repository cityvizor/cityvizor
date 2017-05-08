var express = require('express');	
var app = express();

var router = module.exports = express.Router();

var multer = require('multer');
var upload = multer({ dest: 'uploads/tmp' });

var fs = require("fs");

var acl = require("express-dynacl");

var ExpenditureImport = require("../import/expenditures");
var EventsImport = require("../import/events");

router.use("/expenditures",require("./import-expenditures.js"));

router.use("/events",require("./import-events.js"));