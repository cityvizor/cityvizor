var express = require('express');	
var router = module.exports = express.Router({mergeParams: true});

var acl = require("express-dynacl");

var Event = require("../models/expenditures").Event;

router.get("/", acl("profile-events", "list"), (req,res) => {
	
	var query = Event.find({profile:req.params.profile})
	
	query.select(req.query.fields || "srcId name year");
	
	if(req.query.sort) query.sort(req.query.sort);
	if(req.query.year) query.where({year: req.query.year});

	query
		.then(events => res.json(events ? events : []))
		.catch(err => res.status(500).send(err));
	
});