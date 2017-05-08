var express = require('express');	
var app = express();

var router = express.Router({mergeParams: true});

var acl = require("express-dynacl");

var Contract = require("../models/contract");

router.get("/", acl("profile-contracts", "list"), (req,res) => {
	
	var query = Contract.find({profile:req.params.profile});
	
	if(req.query.limit) query.limit(Number(req.query.limit));
	if(req.query.sort) query.sort(req.query.sort);
	
	query
		.then(contracts => res.json(contracts))
		.catch(err => res.status(500).send(err));

});

module.exports = router;