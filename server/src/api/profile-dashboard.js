var express = require('express');
var app = express();

var router = module.exports = express.Router({mergeParams: true});

var acl = require("express-dynacl");

var etlFilter = require("../middleware/etl-filter");

var Budget = require("../models/expenditures").Budget;

router.get("/",etlFilter({visible:true}), acl("profile-dashboard","read"), function(req,res,next){

	Budget.find({ profile:req.params.profile, etl: {$in:req.etls}	})
		.select("year paragraphs.id paragraphs.expenditureAmount paragraphs.budgetExpenditureAmount")
		.then(budgets => {
		
			// sum amounts
			function sumItems(budget,rule,amountKey){
				return budget.paragraphs.filter(rule).reduce((sum,paragraph) => sum = sum + paragraph[amountKey],0);
			}
			
			// create objects
			function getAmounts(rule){
				return budgets.map(budget => ({
					year: budget.year,
					amount: sumItems(budget,rule,"expenditureAmount"),
					budgetAmount: sumItems(budget,rule,"budgetExpenditureAmount")
				}));
			}
			
			// decide filtering rule
			function getGroups(groups){
				return getAmounts(paragraph => groups.indexOf(paragraph.id.substr(0,2)) !== -1);
			}
			
			function getParagraphs(paragraphs){
				return getAmounts(paragraph => paragraphs.indexOf(paragraph.id) !== -1);
			}
		
			let dashboard = {
				transportation: getGroups("22"),
				schools: getGroups(["31","32"]),
				housing: getParagraphs("3612"),
				culture: getGroups("33"),
				sports: getGroups("34"),
				government: getGroups("61")
			}

			res.json(dashboard);
		});
});