var express = require('express');	
var app = express();

var router = express.Router({mergeParams: true});

var acl = require("express-dynacl");

var Payment = require("../models/expenditures").Payment;

router.get("/", acl("profile-payments", "list"), (req,res) => {
	
	var query = Payment.find({profile:req.params.profile})
		
	if(req.query.sort) query.sort(req.query.sort);
	query.limit(req.query.limit ? Math.min(100,Number(req.query.limit)) : 100);
							
	query
		.then(payments => res.json(payments ? payments : []))
		.catch(err => res.status(500).send(err));

});

module.exports = router;