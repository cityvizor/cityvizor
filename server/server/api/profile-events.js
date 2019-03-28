var express = require('express');	
var router = module.exports = express.Router({mergeParams: true});

var schema = require('express-jsonschema');
var acl = require("express-dynacl");

var etlFilter = require("../middleware/etl-filter");

var Event = require("../models/expenditures").Event;

var eventSchema = {
	type: "object",
	properties: {
		"srcId": {type: "string"},
		"sort": {type: "string"},
		"year": {type: "number"},
		"fields": {type: "string"}
	}	
};

router.get("/", etlFilter({visible:true}), schema.validate({body: eventSchema}), acl("profile-events", "list"), (req,res) => {
	
	var query = Event.find({profile:req.params.profile, etl: {$in: req.etls}});
	
	query.select(req.query.fields || "srcId name year incomeAmount budgetIncomeAmount expenditureAmount budgetExpenditureAmount");
	
	if(req.query.srcId) query.where({srcId: req.query.srcId});
	if(req.query.sort) query.sort(req.query.sort);
	if(req.query.year) query.where({year: req.query.year});

	query
		.then(events => res.json(events ? events : []))
		.catch(err => res.status(500).send(err));
	
});