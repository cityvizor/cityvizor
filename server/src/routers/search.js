var express = require('express');	
var router = module.exports = express.Router({mergeParams: true});

var schema = require('express-jsonschema');
var acl = require("express-dynacl");


router.post("/counterparties", acl("payments", "list"), (req,res,next) => {
	
});

router.post("/payments", acl("payments", "list"), (req,res,next) => {
	
});