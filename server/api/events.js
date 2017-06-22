var express = require('express');	
var router = express.Router();

var acl = require("express-dynacl");

var Event = require("../models/expenditures").Event;

router.get("/", acl("events", "list"), (req,res) => {
	Event.find({}, (err,item) => {
		if(item) res.json(item);
		else res.status(404).send('Not found');
	});
});

router.get("/:id", acl("events", "list"), (req,res) => {
	
	Event.find({_id:req.params.id}).select("event name expenditureAmount incomeAmount")
		.then(event => res.json(event))
		.catch(err => res.status(500).send(err));
	
});

router.get("/:id/:year", acl("events", "read"), (req,res) => {
	
	Event.findOne({ _id: req.params.id, year: req.params.year })
		.then(event => res.json(event))
		.catch(err => res.status(500).send(err));
	
});

module.exports = router;