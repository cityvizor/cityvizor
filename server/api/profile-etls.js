var express = require('express');	
var app = express();

var router = express.Router({mergeParams: true});

var acl = require("express-dynacl");

var Contract = require("../models/contract");

router.get("/", acl("profile-etls","list"), (req,res) => {
	
	var where = {profile:req.params.profile};
	
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


module.exports = router;