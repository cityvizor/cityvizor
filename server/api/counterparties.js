// load express app and export router
var express = require('express');	
var router = module.exports = express.Router();

// load the dependeces
var schema = require('express-jsonschema');
var acl = require("express-dynacl");

var etlFilter = require("../middleware/etl-filter");

// load schemas
var Counterparty = require("../models/counterparty");

// REQUEST: get event

router.get("/search", etlFilter({visible:true}), acl("counterparty","list"), (req,res,next) => {
  
  var match = {};
  
  var query = Counterparty.aggregate([
    {
      $match: {
        etl: {$in: req.etls},
        $or: [{name: new RegExp(req.query.query,"i")},{counterpartyId: req.query.query}]
      }
    },
    { $group: {_id : "$counterpartyId", "name": {$first: "$name"}} },
    { $limit: 10 },
    { $project: {_id:0, "counterpartyId": "$_id", "name":"$name"} }
  ]);

  query.then(counterparties => res.json(counterparties)).catch(err => next(err));
  
});
           
router.get("/:id", etlFilter({visible:true}), acl("counterparty", "read"), (req,res,next) => {
	
	Counterparty.find({counterpartyId:req.params.id, etl: {$in: req.etls}}).populate("profile","_id name")
		.then(counterpartyData => {
		
			if(!counterpartyData.length) return res.sendStatus(404);
		
			let first = counterpartyData[0];
		
			var profiles = [];
			var profileIndex = {};
		
			counterpartyData.forEach(item => {
				
				if(!profileIndex[item.profile._id]) {
					let profile = {
						"_id": item.profile._id,
						"name": item.profile.name,
						"budgets": []
					};
					
					profileIndex[item.profile._id] = profile;
					profiles.push(profile);
				}
				
				profileIndex[item.profile._id].budgets.push({
					"year": item.year,
					"etl": item.etl,
					"amount": Number(item.amount) || 0
				});
				
			});
		
			let counterparty = {
				_id: first.counterpartyId,
				name: first.name,
				amount: counterpartyData.reduce((acc,cur) => acc + (Number(cur.amount) || 0), 0),
				profiles: profiles
			};
		
			res.json(counterparty);
		})
		.catch(err => next(err));
	
});