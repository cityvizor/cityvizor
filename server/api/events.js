var express = require('express');	
var app = express();

var router = express.Router();

var acl = require("../acl/index");

var Event = require("../models/expenditures").Event;
var EventBudget = require("../models/expenditures").EventBudget;

router.get("/:id", acl("events", "read"), (req,res) => {
	Event.findOne({_id:req.params.id}).lean().exec((err,event) => {
		
		if(!event) return res.status(404).send('Not found');
		
		EventBudget.find({event:event._id}, (err,eventBudgets) => {
			event.budgets = eventBudgets ? eventBudgets: [];
			res.json(event);
		});
		
	});
});

router.get("/", acl("events", "list"), (req,res) => {
	Event.find({}, (err,item) => {
		if(item) res.json(item);
		else res.status(404).send('Not found');
	});
});

module.exports = router;