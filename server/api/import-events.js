var express = require('express');	
var app = express();

var router = module.exports = express.Router();

var multer = require('multer');
var upload = multer({ dest: 'uploads/tmp' });

var fs = require("fs");

var acl = require("express-dynacl");

var EventsImport = require("../import/events");
var ETL = require("../models/etl");

router.post("/", upload.single("file"), acl("profile-events", "write"), (req,res) => {
	
	if(!req.file || !req.body.profile){
		res.status(400).send("Bad request (Missing file or profile parameters)");
		return;
	}

	EventsImport(req).then(etlLog => res.json(etlLog));
	
});