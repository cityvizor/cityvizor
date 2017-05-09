var express = require('express');	
var app = express();

var router = express.Router({mergeParams: true});

var acl = require("express-dynacl");

var Event = require("../models/expenditures").Event;
var EventBudget = require("../models/expenditures").EventBudget;
var Payment = require("../models/expenditures").Payment;


router.get("/", acl("profile-events", "list"), (req,res) => {
	
	var query = Event.find({profile:req.params.profile})
	
	query.select(req.query.fields || "event name");
	if(req.query.sort) query.sort(req.query.sort);

	query
		.then(events => res.json(events ? events : []))
		.catch(err => res.status(500).send(err));
	
});

router.get("/:event", acl("profile-events", "list"), (req,res) => {
	
	Event.findOne({profile:req.params.profile,event:req.params.event}).lean()
		.then(event => {
			let queries = [];
			queries.push(EventBudget.find({profile:req.params.profile,event:req.params.event}).lean().then(budgets => event.budgets = budgets).catch(err => res.status(500).send(err)));
			queries.push(Payment.find({profile:req.params.profile,event:req.params.event}).lean().then(payments => event.payments = payments).catch(err => res.status(500).send(err)));
			Promise.all(queries).then(() => res.json(event));
		})
		.catch(err => res.status(500).send(err));
	
});

module.exports = router;