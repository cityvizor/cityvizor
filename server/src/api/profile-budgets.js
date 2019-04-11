var express = require('express');	
var app = express();

var router = express.Router({mergeParams: true});

var schema = require('express-jsonschema');
var acl = require("express-dynacl");

var config = require("../../config");

var multer = require('multer');
var upload = multer({ dest: config.storage.tmp });

var fs = require("fs-extra");
var path = require("path");

var etlFilter = require("../middleware/etl-filter");

var Profile = require("../models/profile");
var Budget = require("../models/expenditures").Budget;
var Event = require("../models/expenditures").Event;
var Payment = require("../models/expenditures").Payment;

router.get("/", etlFilter({visible:true}), acl("profile-budgets","list"), (req, res, next) => {

	var query = Budget.find({profile:req.params.profile, etl: {$in: req.etls}});

	query.select("year budgetExpenditureAmount budgetIncomeAmount expenditureAmount incomeAmount");
	query.populate("etl","validity success");

	if(req.query.limit) query.limit(req.query.limit);
	if(req.query.sort) query.sort(req.query.sort);

	query
		.then(budgets => res.json(budgets))
		.catch(err => next(err));

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

module.exports = router;