var express = require('express');	
var app = express();

var router = express.Router({mergeParams: true});

var acl = require("../acl/index");

var Invoice = require("../models/expenditures").Invoice;

router.get("/latest", acl("profile-invoices", "list"), (req,res) => {
	
	Invoice.find({profile:req.params.profile}).sort({ date: -1 }).limit(5)
		.then(invoices => res.json(invoices ? invoices : []))
		.catch(err => res.status(500).send(err));

});

module.exports = router;