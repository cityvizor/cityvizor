var express = require('express');	
var app = express();

var router = express.Router({mergeParams: true});

var acl = require("../acl/index");

var Event = require("../models/expenditures").Event;
var EventBudget = require("../models/expenditures").EventBudget;

router.get("/", acl("events", "list"), (req,res) => {
	
	Event.find({profile:req.params.profile}).select("id name gps from till")
		.then(events => res.json(events ? events : []))
		.catch(err => res.status(500).send(err));
	
});

module.exports = router;