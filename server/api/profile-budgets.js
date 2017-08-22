var express = require('express');	
var app = express();

var router = express.Router({mergeParams: true});

var acl = require("express-dynacl");

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

router.delete("/:year", acl("profile-budgets", "write"), (req,res) => {
	
	var queries = [];
	queries.push(Budget.remove({profile:req.params.profile,year:req.params.year}));
	queries.push(Event.remove({profile:req.params.profile,year:req.params.year}));
	queries.push(Payment.remove({profile:req.params.profile,year:req.params.year}));
	
	Promise.all(queries)
		.then(() => res.sendStatus(200))
		.catch(err => res.status(500).send(err.message));
	
});

module.exports = router;