var express = require('express');	
var app = express();

var router = express.Router();

var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

var acl = require("../acl/index");

var Budget = require("../models/expenditures").Budget;
var Event = require("../models/expenditures").Event;
var EventBudget = require("../models/expenditures").EventBudget;

var ExpenditureImport = require("../import/expenditures");

router.get("/budget/:id/:rok", acl("budget", "read"), (req,res) => {
	Budget.findOne({profile:req.params.id,year:req.params.rok}, (err,item) => {
		if(item) res.json(item);
		else res.status(404).send('Not found');
	});
});

router.get("/events/:id", acl("expenditures", "read"), (req,res) => {
	Event.findOne({_id:req.params.id}).lean().exec((err,event) => {
		
		if(!event) {
			res.status(404).send('Not found');
			return;
		}
		
		EventBudget.find({event:event._id}, (err,eventBudgets) => {
			
			event.budgets = eventBudgets ? eventBudgets: [];
			
			res.json(event);
			
		});
		
	});
});

router.get("/events", acl("expenditures", "read"), (req,res) => {
	Event.findOne({profile:req.params.id}, (err,item) => {
		if(item) res.json(item);
		else res.status(404).send('Not found');
	});
});

router.post("/import/:id/:rok", acl("expenditures", "write"), acl("budget", "write"), upload.single('file'), (req,res) => {
	
	console.log(req.file);
	
	if(req.file.path){
		ExpenditureImport(req.file.path,req.params.id,req.params.rok);
		res.sendStatus(200);
	}
	else {
		res.sendStatus(500);
	}	
});

module.exports = router;