var express = require('express');	
var app = express();

var router = module.exports = express.Router();

var multer = require('multer');
var upload = multer({ dest: 'uploads/tmp' });

var acl = require("express-dynacl");

router.use("/expenditures",require("./import-expenditures.js"));