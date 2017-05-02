var express = require('express');
var app = express();

var acl = require("express-dynacl");

var router = express.Router();
module.exports = router;

var ETL = require("../models/etl");

router.get("/", acl("etl","list"), (req,res) => {
	
	var where = {};
	if(req.query.profile) where.profile = req.query.profile;
	
	var options = {
		populate: {path: "user", select: "name organization"},
		page: req.query.page ? Number(req.query.page) : 1,
		limit: req.query.limit ? Number(req.query.limit) : 20
	};
	if(req.query.sort) options.sort = req.query.sort;
	
	ETL.paginate(where,options)
		.then(etl => res.json(etl))
		.catch(err => res.status(500).send(err));
	
});

router.get("/latest/:profile", acl("etl","list"), (req,res) => {
	
	var expenditures = ETL.findOne({profile:req.params.profile,target:"expenditures"}).sort("-date").populate("user","name organization");		
	
	var events = ETL.findOne({profile:req.params.profile,target:"events"}).sort("-date").populate("user","name organization");
	
	Promise.all([expenditures,events])
		.then(values => res.json({expenditures:values[0],events:values[1]}))
		.catch(err => res.status(500).send(err));
	
	
});