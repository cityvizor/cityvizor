var express = require('express');	
var app = express();

var router = express.Router({mergeParams: true});

var schema = require('express-jsonschema');
var acl = require("express-dynacl");

var config = require("../config/config");

var multer = require('multer');
var upload = multer({ dest: config.storage.tmpDir });

var fs = require("fs");
var path = require("path");

var Profile = require("../models/profile");
var Budget = require("../models/expenditures").Budget;
var Event = require("../models/expenditures").Event;
var Payment = require("../models/expenditures").Payment;

router.get("/", acl("profile-budgets","list"), (req,res) => {
	
	var query = Budget.find({profile:req.params.profile});
	
	query.select("year budgetExpenditureAmount budgetIncomeAmount expenditureAmount incomeAmount");
	query.populate("etl","validity success");
	
	if(req.query.limit) query.limit(req.query.limit);
	if(req.query.sort) query.sort(req.query.sort);
	
	query
		.then(years => res.json(years ? years : []))
		.catch(err => res.status(500).send(err.message));

});

router.get("/:year", acl("profile-budgets", "read"), (req,res) => {
	
	Budget.findOne({profile:req.params.profile,year:req.params.year})
		.then(budget => budget ? res.json(budget) : res.sendStatus(404))
		.catch(err => res.status(500).send(err.message));
	
});

var budgetSchema = {
	type: "object",
	properties: {
		"validity": { type: "string" }, // date
		"note": { type: "string" }
	}
};

router.put("/:year", schema.validate({body: budgetSchema}), upload.fields([{ name:"eventsFile", maxCount: 1 }, { name:"expendituresFile", maxCount: 1 }]), acl("profile-events", "write"), acl("profile-budgets", "write"), (req,res) => {
	/*
	if(!req.files || !req.files.eventsFile || !req.files.expendituresFile) return res.status(400).send("Chybí nahrávaný soubor.");
	
	if(path.extname(req.files.eventsFile[0].originalname) !== ".csv") return res.status(400).send("Nesprávný formát číselníku akcí. Soubory musí být ve formátu CSV.");
	if(path.extname(req.files.expendituresFile[0].originalname) !== ".csv") return res.status(400).send("Nesprávný formát datového souboru. Soubory musí být ve formátu CSV.");

	var warnings = [];
	
	var parser = new Parser_NativeCSV(req.files.eventsFile[0].path, req.files.expendituresFile[0].path);
	parser.on("warning",warning => warnings.push(warning));
	
	var writer = new ImportWriter(req.params.profile,req.params.year);
	writer.on("warning",warning => warnings.push(warning));
	
	parser.parseTo(writer)
		.then(() => {
		
			// send response
			res.json({success: true, warnings: warnings, error: null});
		
			// delete uploaded files
			fs.unlink(req.files.eventsFile[0].path,err => {});
			fs.unlink(req.files.expendituresFile[0].path,err => {});
			
			// save info about new data
			Profile.findOne({profile: req.params.profile})
				.then(profile => {
					let budgets = profile.budgets.filter(budget => budget.year !== Number(req.params.year));
					budgets.push({year: req.params.year, validity: req.body.validity, lastCheck: new Date()});
					profile.budgets = budgets;
					profile.save();
				})
				.catch(err => console.error("Error when updating profile budgets info: " + err.message));
		
		})
		.catch(err => {
			
			// delete uploaded files
			fs.unlink(req.files.eventsFile[0].path,err => {});
			fs.unlink(req.files.expendituresFile[0].path,err => {});
			
			// send response
			res.status(400).send(err.message);
		});
	*/
});

router.delete("/:year", acl("profile-budgets", "write"), (req,res) => {
	
	var queries = [];
	queries.push(Budget.remove({profile:req.params.profile,year:req.params.year}));
	queries.push(Event.remove({profile:req.params.profile,year:req.params.year}));
	queries.push(Payment.remove({profile:req.params.profile,year:req.params.year}));
	
	Promise.all(queries)
		.then(() => {
			fs.unlink(config.storage.importsDir + "/" + req.params.profile + "-" + req.params.year + ".events.csv",err => {});
			fs.unlink(config.storage.importsDir + "/" + req.params.profile + "-" + req.params.year + ".data.csv",err => {});
			res.sendStatus(200);
		})
		.catch(err => res.status(500).send(err.message));
	
});

module.exports = router;