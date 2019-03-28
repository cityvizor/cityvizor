var express = require('express');
var app = express();

var router = express.Router();
module.exports = router;

var schema = require('express-jsonschema');
var acl = require("express-dynacl");

var CodeList = require("../models/codelist.js");


router.get("/", acl("codelists","list"), (req,res,next) => {
	
	CodeList.find().select("_id description")
		.then(codelists => res.json(codelists))
		.catch(err => next(err));
	
});

router.get("/:name", acl("codelists","read"), (req,res,next) => {
	
	CodeList.findOne({_id: req.params.name})
		.then(codelist => {
			if(!codelist) return res.sendStatus(404);
			res.json(codelist);
		})
		.catch(err => next(err));
});