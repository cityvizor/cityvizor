var express = require('express');	
var app = express();

var router = module.exports = express.Router();

var config = require("../config/config.js");

var multer = require('multer');
var upload = multer({ dest: config.uploads.dir });

var fs = require("fs");

var schema = require('express-jsonschema');
var acl = require("express-dynacl");

var ExpenditureImporter = require("../import/expenditures");

var expendituresSchema = {
	type: "object",
	properties: {
		"profile": { type: "string", /*pattern: "[a-fA-F0-9]{24}"*/ },
		"year": { type: "number" },
		"validity": { type: "string" } // date
	}
};

router.post("/", schema.validate({body: expendituresSchema}), upload.fields([{ name:"eventsFile", maxCount: 1 }, { name:"expendituresFile", maxCount: 1 }]), acl("profile-events", "write"), acl("profile-budgets", "write"), (req,res) => {

	var profileId = req.body.profile;
	var year = req.body.year;
	
	if(!req.files) return res.status(400).send("Bad Request (missing events and expenditures attributes)");
	
	var importer = new ExpenditureImporter({});
	
	var params = {
		profileId: req.body.profile,
		year: req.body.year,
		validity: req.body.validity,
		eventsFile: req.files.eventsFile[0].path,
		expendituresFile: req.files.expendituresFile[0].path
	};
	
	importer.import(params)
		.then(result => {
			res.json(result);
			fs.rename(req.files.eventsFile[0].path,config.import.saveDir + "/" + params.profileId + "-" + params.year + ".events.csv");
			fs.rename(req.files.expendituresFile[0].path,config.import.saveDir + "/" + params.profileId + "-" + params.year + ".expenditures.csv");
		})
		.catch(err => {
			fs.unlink(req.files.eventsFile[0].path);
			fs.unlink(req.files.expendituresFile[0].path);
			res.status(500).send(err.message);
		}); // TODO PROPER ERROR
	
});