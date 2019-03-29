// load express app and export router
var express = require('express');	
var router = module.exports = express.Router();

// load the dependeces
var schema = require('express-jsonschema');
var acl = require("express-dynacl");

// load schemas
var ETL = require("../models/etl").Event;
var ETLLog = require("../models/etl-log").Payment;

// schema validation
var etlsSchema = {
	type: "object",
	properties: {
		"sort": {type: "string", required: false}
	}	
};

router.get("/", schema.validate({query: etlsSchema}), acl("etls","list"), (req,res,next) => {
	
	var query = ETL.find({})
		.then(etls => res.json(etls))
		.catch(err => next(err));

});

router.get("/:etl", acl("etls","read"), (req,res,next) => {
	
	ETL.findOne({_id:req.params.etl})
		.then(etl => res.json(etl))
		.catch(err => next(err));

});

router.get("/:etl/logs", acl("etllogs","list"), acl("etllogs","read"), (req,res,next) => {
	
	ETLLog.find({etl:req.params.etl})
		.then(etls => res.json(etls))
		.catch(err => next(err));

});