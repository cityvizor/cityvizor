var express = require('express');	
var app = express();

var router = express.Router();

var archiver = require("archiver");

var acl = require("../acl/index");

var Budget = require("../models/expenditures").Budget;
var Entity = require("../models/entity");

router.get("/budgets", acl("exports", "budgets"), (req,res) => {
	
	var archive = archiver("zip");

	archive.on('error', err => {throw err;});
	archive.pipe(res);
	
	res.writeHead(200, {'Content-Type': 'application/zip','Content-disposition': 'attachment; filename=budgets.zip'});
	
	Budget.find({}).populate("profile","name url entity")
		.then(items => {
			items.forEach(item => archive.append(JSON.stringify(item),{"name": item.profile._id + "-" + item.year + ".json"}));
			archive.finalize();
		});
	
});

router.get("/entities", acl("exports", "budgets"), (req,res) => {
	
	var archive = archiver("zip");

	archive.on('error', err => {throw err;});
	archive.pipe(res);
	
	res.writeHead(200, {'Content-Type': 'application/zip','Content-disposition': 'attachment; filename=entities.zip'});
	
	Entity.find({}).then(items => {
		archive.append(JSON.stringify(items),{"name": "entities.json"});
		archive.finalize();
	});
	
	
	
});

module.exports = router;