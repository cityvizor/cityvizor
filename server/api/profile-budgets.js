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

var BudgetImporter = require("../importers/budget");

var Budget = require("../models/expenditures").Budget;
var Event = require("../models/expenditures").Event;
var Payment = require("../models/expenditures").Payment;

router.get("/", acl("profile-budgets","list"), (req,res) => {
	
	var query = Budget.find({profile:req.params.profile});
	
	query.select("year validity budgetExpenditureAmount budgetIncomeAmount expenditureAmount incomeAmount");
	
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
	
	if(!req.files || !req.files.eventsFile || !req.files.expendituresFile) return res.status(400).send("Chybí nahrávaný soubor.");
	
	if(path.extname(req.files.eventsFile[0].originalname) !== ".csv") return res.status(400).send("Nesprávný formát číselníku akcí. Soubory musí být ve formátu CSV.");
	if(path.extname(req.files.expendituresFile[0].originalname) !== ".csv") return res.status(400).send("Nesprávný formát datového souboru. Soubory musí být ve formátu CSV.");
	
	var params = {
		profileId: req.params.profile,
		year: req.params.year,
		validity: req.body.validity,
		eventsFile: req.files.eventsFile[0].path,
		expendituresFile: req.files.expendituresFile[0].path
	};
	
	var budgetImporter = new BudgetImporter();
	
	budgetImporter.import(params)
		.then(result => {
		
			fs.rename(req.files.eventsFile[0].path,config.storage.importsDir + "/" + params.profileId + "-" + params.year + ".events.csv",() => {});
			fs.rename(req.files.expendituresFile[0].path,config.storage.importsDir + "/" + params.profileId + "-" + params.year + ".data.csv",() => {});
		
			return res.json(result);
		})
		.catch(err => {
		
			fs.unlink(req.files.eventsFile[0].path,() => {});
			fs.unlink(req.files.expendituresFile[0].path,() => {});
		
			return res.status(400).send(err.message);
		});
	
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