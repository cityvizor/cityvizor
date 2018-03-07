var express = require('express');	
var router = module.exports = express.Router({mergeParams: true});

var schema = require('express-jsonschema');
var acl = require("express-dynacl");

var etlFilter = require("../middleware/etl-filter");

var Profile = require("../models/profile");
var ETL = require("../models/etl");
var Budget = require("../models/budget");
var Event = require("../models/event");
var Payment = require("../models/payment");
var Codelist = require("../models/codelist");

function serveExport(req,res,filename,json){
	res.setHeader("Cache-Control", "public, max-age=600");
	if(req.query.download) res.attachment(filename);

	res.json(json);
}

router.get("/profiles", acl("exports-profiles", "list"), (req,res,next) => {
	Profile.find({status: { $in: ["active","pending"]}})
		.then(profiles => serveExport(req,res,"profiles.json",profiles))
		.catch(err => next(err));
});

router.get("/profiles/:profile", acl("exports-profiles", "read"), (req,res,next) => {
	Profile.findOne({_id: req.params.profile})
		.then(profile => serveExport(req,res,"profile-" + req.params.profile + ".json",profile))
		.catch(err => next(err));
});

router.get("/codelists/:codelist", etlFilter({visible:true}), acl("exports-budgets", "read"), (req,res,next) => {
	Codelist.findOne({_id:req.params.codelist})
		.then(codelists => serveExport(req,res,"codelist-" + req.params.codelist + ".json",codelists))
		.catch(err => next(err));
});

router.get("/profiles/:profile/etls", etlFilter({visible:true}), acl("exports-etls", "read"), (req,res,next) => {
	ETL.find({profile:req.params.profile, _id: {$in: req.etls}}).select("_id year lastModified")
		.then(etls => serveExport(req,res,"etls-" + req.params.profile + ".json",etls))
		.catch(err => next(err));
});

router.get("/profiles/:profile/budgets", etlFilter({visible:true}), acl("exports-budgets", "read"), (req,res,next) => {
	
	Budget.find({profile:req.params.profile, etl: {$in: req.etls}}).select("year etl budgetExpenditureAmount budgetIncomeAmount expenditureAmount incomeAmount")
		.then(budgets => serveExport(req,res,"budgets-" + req.params.profile + ".json",budgets))
		.catch(err => next(err));
});

router.get("/profiles/:profile/events/:year", etlFilter({visible:true}), acl("exports-budgets", "read"), (req,res,next) => {
	
	Event.find({profile:req.params.profile, etl: {$in: req.etls}, year: req.params.year})
		.then(events => serveExport(req,res,"events-" + req.params.profile + "-" + req.params.year + ".json",events))
		.catch(err => next(err));
});

router.get("/profiles/:profile/budgets/:year", etlFilter({visible:true}), acl("exports-budgets", "read"), (req,res,next) => {
	
	Budget.findOne({profile:req.params.profile, year:req.params.year, etl: {$in: req.etls}})
		.then(budget => serveExport(req,res,"budget-" + req.params.profile + "-" + req.params.year + ".json",budget))
		.catch(err => next(err));
});

router.get("/profiles/:profile/payments/:year", etlFilter({visible:true}), acl("exports-payments", "read"), (req,res,next) => {
	
	Payment.find({profile: req.params.profile, year: req.params.year, etl: {$in: req.etls}})
		.then(payments => serveExport(req,res,"payments-" + req.params.profile + "-" + req.params.year + ".json",payments))
		.catch(err => next(err));
});