var express = require('express');	
var router = module.exports = express.Router({mergeParams: true});

var schema = require('express-jsonschema');
var acl = require("express-dynacl");

var etlFilter = require("../middleware/etl-filter");

var Profile = require("../models/profile");
var ETL = require("../models/etl");
var Budget = require("../models/budget");
var Payment = require("../models/payment");

router.get("/profiles", acl("exports-profiles", "list"), (req,res,next) => {
	Profile.find({status: { $in: ["active","pending"]}})
		.then(profiles => res.json(profiles))
		.catch(err => next(err));
});

router.get("/profiles/:profile", acl("exports-profiles", "read"), (req,res,next) => {
	Profile.findOne({_id: req.params.profile})
		.then(profile => res.json(profile))
		.catch(err => next(err));
});

router.get("/profiles/:profile/etls", etlFilter({visible:true}), acl("exports-etls", "read"), (req,res,next) => {
	ETL.find({profile:req.params.profile, _id: {$in: req.etls}}).select("_id year lastModified")
		.then(etls => res.json(etls))
		.catch(err => next(err));
});

router.get("/profiles/:profile/budgets", etlFilter({visible:true}), acl("exports-budgets", "read"), (req,res,next) => {
	
	Budget.find({profile:req.params.profile, etl: {$in: req.etls}}).select("year etl budgetExpenditureAmount budgetIncomeAmount expenditureAmount incomeAmount")
		.then(budgets => res.json(budgets))
		.catch(err => next(err));
});

router.get("/profiles/:profile/budgets/:year", etlFilter({visible:true}), acl("exports-budgets", "read"), (req,res,next) => {
	
	Budget.findOne({profile:req.params.profile, year:req.params.year, etl: {$in: req.etls}})
		.then(budget => {
			
			res.setHeader("Cache-Control", "public, max-age=10m");
		
			var filename = "budget-" + req.params.profile + "-" + req.params.year + ".json";
			res.attachment(filename);	
		
			res.json(budget)
		})
		.catch(err => next(err));
});

router.get("/profiles/:profile/payments/:year", etlFilter({visible:true}), acl("exports-payments", "read"), (req,res,next) => {
	
	Payment.find({profile: req.params.profile, year: req.params.year, etl: {$in: req.etls}})
		.then(payments => {
		
			res.setHeader("Cache-Control", "public, max-age=10m");
			
			var filename = "payments-" + req.params.profile + "-" + req.params.year + ".json";
			res.attachment(filename);	
		
			res.json(payments)
		})
		.catch(err => next(err));
});