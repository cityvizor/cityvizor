var express = require('express');
var app = express();

var router = express.Router({mergeParams: true});

var acl = require("express-dynacl");

var Budget = require("../models/expenditures").Budget;

router.get("/", acl("profile-budget","read"), function(req,res){
	var dashboard = {
		expenditures: null,
		income: null
	};
	Budget.find({profile:req.params.profile}, "ico year budgetAmount expenditureAmount", (err,items) => {
		if(items) dashboard.expenditures = err ? [] : items;
		res.json(dashboard);
	});
});


module.exports = router;