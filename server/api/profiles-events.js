var express = require('express');	
var app = express();

var router = express.Router({mergeParams: true});

var acl = require("../acl/index");

var Event = require("../models/expenditures").Event;
var EventBudget = require("../models/expenditures").EventBudget;
var Invoice = require("../models/expenditures").Invoice;


router.get("/", acl("events", "list"), (req,res) => {
	
	var fields = req.body.fields ? req.body.fields : "id name";
	
	Event.find({profile:req.params.profile}).select(fields)
		.then(events => res.json(events ? events : []))
		.catch(err => res.status(500).send(err));
	
});

router.get("/:id", acl("events", "list"), (req,res) => {
	
	var output;
	var queries = [];
	
	queries.push(Event.findOne({profile:req.params.profile,id:req.params.id}).lean().then(event => output = event).catch(err => res.status(500).send(err)))
	
	queries.push(EventBudget.find({profile:req.params.profile,event:req.params.id}).lean().then(budgets => output.budgets = budgets).catch(err => res.status(500).send(err)));
	
	queries.push(Invoice.find({profile:req.params.profile,event:req.params.id}).lean().then(invoices => output.invoices = invoices).catch(err => res.status(500).send(err)));
	
	Promise.all(queries).then(() => res.json(output));
	
});

module.exports = router;