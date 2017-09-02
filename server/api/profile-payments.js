var express = require('express');	
var app = express();

var router = express.Router({mergeParams: true});

var acl = require("express-dynacl");

var Payment = require("../models/expenditures").Payment;

router.get("/", acl("profile-payments", "list"), (req,res) => {
	
	var query = {};
	query.profile = req.params.profile;
	if(req.query.dateFrom || req.query.dateTo){
		query.date = {};
		if(req.query.dateFrom) query.date.$gte = new Date(req.query.dateFrom);
		if(req.query.dateTo) query.date.$lt = new Date(req.query.dateTo);
	}
	
	var options = {};
	options.page = req.query.page || 1;
	if(req.query.sort) options.sort = req.query.sort;
	options.limit = req.query.limit ? Math.min(100,Number(req.query.limit)) : 20;
							
	Payment.paginate(query, options)
		.then(payments => res.json(payments ? payments : []))
		.catch(err => res.status(500).send(err.message));

});

router.get("/months", acl("profile-payments", "list"), (req,res) => {
	
	let aggregation = [
			{
				$project: {year: { $year: "$date" }, month: { $month: "$date" }}
			},
			{ "$group": {
				"_id": null, 
				"months": { "$addToSet": { "year": "$year", "month": "$month" }}
			}}
		];
	
	Payment.aggregate(aggregation)
		.then(result => res.json(result[0].months))
		.catch(err => res.status(500).send(err.message));
	
});

module.exports = router;