var express = require('express');	
var app = express();

var router = express.Router({mergeParams: true});

var acl = require("express-dynacl");

var Contract = require("../models/contract");

router.get("/", acl("profile-contracts", "list"), (req,res) => {
	
	Contract.find({profile:req.params.profile}).sort({ date: -1 })
		.then(contracts => res.json(contracts))
		.catch(err => res.status(500).send(err));

});

module.exports = router;