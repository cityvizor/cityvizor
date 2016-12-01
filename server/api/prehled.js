var express = require('express');
var app = express();

var router = express.Router();

var Expenditures = require("../models/expenditures");

router.get("/:ico",function(req,res){
	var dashboard = {
		expenditures: null,
		income: null
	};
	Expenditures.find({ico:req.params.ico}, "ico year budgetAmount expenditureAmount", (err,items) => {
		if(items) dashboard.expenditures = err ? [] : items;
		res.json(dashboard);
	});
});


module.exports = router;