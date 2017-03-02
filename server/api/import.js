var express = require('express');	
var app = express();

var router = express.Router();

var multer = require('multer');
var upload = multer({ dest: 'server/uploads/tmp' });

var acl = require("../acl/index");

var ExpenditureImport = require("../import/expenditures");
var EventsImport = require("../import/events");

router.post("/expenditures", upload.single("file"), acl("expenditures", "write"), acl("budget", "write"), (req,res) => {
	
	if(!req.file || !req.body.profile || !req.body.year){
		res.status(400).send("Bad request. Missing file, profile or year parameters.");
		return;
	}

	ExpenditureImport(req.file.path,req.body.profile,req.body.year);
	
	res.sendStatus(200);
});

router.post("/events", upload.single("file"), acl("events", "write"), (req,res) => {
	
	if(!req.file || !req.body.profile){
		res.status(400).send("Bad request. Missing file or profile parameters.");
		return;
	}

	EventsImport(req.file.path,req.body.profile);
	
	res.sendStatus(200);
});

module.exports = router;