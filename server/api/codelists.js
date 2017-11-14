var express = require('express');
var app = express();

var router = express.Router();
module.exports = router;

var schema = require('express-jsonschema');
var acl = require("express-dynacl");

var CodeList = require("../models/codelist.js");

var codelistsSchema = {
	type: "object",
	properties: {
		"name": {type: "string"}
	}	
};

router.get("/", schema.validate({query: codelistsSchema}), acl("codelists","list"), (req,res) => {
	
	var query = CodeList.find().select("_id name validFrom validTill");
	
	if(req.query.name) query.where({ name: req.query.name });
	
	query
		.then(codelists => {
			//res.setHeader('Cache-Control', 'public, max-age=0');
			res.json(codelists);
		})
		.catch(err => res.status(500).send(err.message));
	
});

router.get("/:name", acl("codelists","read"), (req,res) => {
	
	CodeList.findOne({name: req.params.name})
		.then(codelist => {
			if(!codelist) return res.sendStatus(404);
			res.setHeader('Cache-Control', 'public, max-age=600'); // dont ask again for ten minutes
			res.json(codelist);
		})
		.catch(err => res.status(500).send(err.message));
});