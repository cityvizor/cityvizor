var express = require('express');
var app = express();

var acl = require("express-dynacl");

var router = express.Router();
module.exports = router;

var ETL = require("../models/etl");

router.get("/", acl("etl","list"), (req,res) => {
	
	var where = {};
	
	if(req.query.profile) where.profile = req.query.profile;
	
	ETL.find(where)
		.then(etl => res.json(etl))
		.catch(err => res.status(500).send(err));
	
});