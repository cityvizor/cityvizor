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
        $or: [
          {$text: {$search: req.query.query}},
          {orgId: req.query.query}
        ],
        etl: {$in: req.etls}
      }
    },
    { $group: {
      _id : "$orgId",
      "name": {$first: "$name"}      
    } },
    { $limit: 10 },
    { $project: {
      "counterpartyId": "$_id",
      "name":"$name"
    } }
  ]);

  query.then(counterparties => res.json(counterparties)).catch(err => next(err));

});

router.get("/:id", etlFilter({visible:true}), acl("counterparty", "read"), async (req,res,next) => {

  var counterparties = await Counterparty.find({ orgId:req.params.id, etl: {$in: req.etls}}).populate("profile","_id name")

  if(!counterparties.length) return res.sendStatus(404);

  res.json(counterparties);
});

router.get("/:id/profiles", etlFilter({visible:true}), acl("counterparty", "read"), async (req,res,next) => {

  var counterparties = await Counterparty.find({ counterpartyId:req.params.id, etl: {$in: req.etls}}).populate("profile","_id name");

  var profiles = [];
  var profileIndex = {};

  counterparties.forEach(item => {

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

  res.json(profiles);
  
});