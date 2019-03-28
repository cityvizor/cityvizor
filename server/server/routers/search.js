var express = require('express');	
var router = module.exports = express.Router({mergeParams: true});

var schema = require('express-jsonschema');
var acl = require("express-dynacl");

var etlFilter = require("../middleware/etl-filter");
var Counterparty = require("../models/counterparty");

router.post("/counterparties", etlFilter({visible:true}), acl("payments", "list"), (req,res,next) => {
	
	var query = [
		{
			$match: {
				$or: [ {"counterpartyId": req.body.query}, {"name": new RegExp(req.body.query,"i")} ]
			}
		},
		{
			$group: {
				"_id": "$counterpartyId",
				"name": { $first: "$name" }
			}
		}
	];
	
	Counterparty.aggregate(query)
		.then(counterparties => res.json(counterparties))
		.catch(err => next(err));
	
});

router.post("/payments", etlFilter({visible:true}), acl("payments", "list"), (req,res,next) => {
	
	var limit = Math.min(20,req.body.limit);
	
	var query = {
		counterpartyName: new RegExp(req.body.counterpartyName,"i"),
		etl: { $in: req.etls }
	};
	
	Payment.find(query).select("_id counterpartyId counterpartyName amount").limit(limit).populate("profile","name")
		.then(payments => res.json(payments))
		.catch(err => next(err));
	
});