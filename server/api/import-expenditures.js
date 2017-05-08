var express = require('express');	
var app = express();

var router = module.exports = express.Router();

var multer = require('multer');
var upload = multer({ dest: 'uploads/tmp' });

var fs = require("fs");

var acl = require("express-dynacl");

var ExpenditureImport = require("../import/expenditures");
var ETL = require("../models/etl");

router.post("/", upload.single("file"), acl("profile-events", "write"), acl("profile-budgets", "write"), (req,res) => {
	
	var profileId = req.body.profile;
	var file = req.file;
	var year = req.body.year;
	
	if(!file || !profileId || !year){
		res.status(400).send("Bad request (Missing file, profile or year parameters)");
		return;
	}
	
	var newPath = "uploads/expenditures/" + profileId + "-" + year + ".csv";
	fs.renameSync(req.file.path, newPath); 

	var etlLog = new ETL();
	etlLog.target = "expenditures";
	etlLog.profile = profileId;
	etlLog.status = "pending";
	etlLog.date = new Date();
	etlLog.file = file.originalname;
	etlLog.user = req.user._id;
	etlLog.year = year;
	etlLog.save()
		.then(etlLog => {
			res.json(etlLog);
			ExpenditureImport(newPath,profileId,year,etlLog);
		})
		.catch(err => console.log(err));

	

});