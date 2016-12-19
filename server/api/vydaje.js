var express = require('express');
var app = express();

var router = express.Router();

var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

var acl = require("../acl/index");

var Budget = require("../models/expenditures").Budget;
var ExpenditureImport = require("../import/expenditures");

router.get("/:id/:rok", acl("budget", "read"), (req,res) => {
	Budget.findOne({entityId:req.params.id,year:req.params.rok}, (err,item) => {
		if(item) res.json(item);
		else res.status(404).send('Not found');
	});
});

router.post("/:id/:rok", acl("expenditures", "write"), upload.single('file'), (req,res) => {
	
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