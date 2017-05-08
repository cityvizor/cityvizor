var express = require('express');	
var app = express();

var router = express.Router();

var acl = require("express-dynacl");

var Event = require("../models/expenditures").Event;
var EventBudget = require("../models/expenditures").EventBudget;
var Payment = require("../models/expenditures").Payment;

router.get("/:id", acl("events", "list"), (req,res) => {
	
	Event.findOne({_id:req.params.id}).lean()
		.then(event => {
		
			if(!event) res.sendStatus(404);
		
			let queries = [];
			queries.push(EventBudget.find({profile:event.profile,event:event.event}).lean().then(budgets => event.budgets = budgets).catch(err => res.status(500).send(err)));
			queries.push(Payment.find({profile:event.profile,event:event.event}).lean().then(payments => event.payments = payments).catch(err => res.status(500).send(err)));
			Promise.all(queries).then(() => res.json(event));
		})
		.catch(err => res.status(500).send(err));
	
});

router.get("/", acl("events", "list"), (req,res) => {
	Event.find({}, (err,item) => {
		if(item) res.json(item);
		else res.status(404).send('Not found');
	});
});

module.exports = router;