var express = require('express');	
var app = express();

var router = module.exports = express.Router();

var config = require("../config/config.js");

var multer = require('multer');
var upload = multer({ dest: config.uploads.saveDir });

var fs = require("fs");
var path = require("path");

var schema = require('express-jsonschema');
var acl = require("express-dynacl");

var ExpenditureImporter = require("./import/expenditures");

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
	
	if(!req.files || !req.files.eventsFile || !req.files.expendituresFile) return res.status(400).send("Chybí nahrávaný soubor.");
	
	if(path.extname(req.files.eventsFile[0].originalname) !== ".csv") return res.status(400).send("Nesprávný formát číselníku akcí. Soubory musí být ve formátu CSV.");
	if(path.extname(req.files.expendituresFile[0].originalname) !== ".csv") return res.status(400).send("Nesprávný formát datového souboru. Soubory musí být ve formátu CSV.");
	
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
		
			fs.rename(req.files.eventsFile[0].path,config.import.saveDir + "/events/" + params.profileId + "-" + params.year + ".csv");
			fs.rename(req.files.expendituresFile[0].path,config.import.saveDir + "/expenditures/" + params.profileId + "-" + params.year + ".csv");
		})
		.catch(err => {
		
			res.status(400).send(err.message);
		
			fs.unlink(req.files.eventsFile[0].path);
			fs.unlink(req.files.expendituresFile[0].path);
		});
	
});