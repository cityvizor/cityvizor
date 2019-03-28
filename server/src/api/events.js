// load express app and export router
var express = require('express');	
var router = module.exports = express.Router();

// load the dependeces
var schema = require('express-jsonschema');
var acl = require("express-dynacl");

// load schemas
var Event = require("../models/expenditures").Event;
var Payment = require("../models/expenditures").Payment;

// schema validation
var eventSchema = {};

// REQUEST: get event
router.get("/:id", schema.validate({query: eventSchema}), acl("events", "read"), (req,res) => {
	
	Event.findOne({_id:req.params.id}).lean()
		.then(event => {
		
			if(!event) return res.sendStatus(404);
			
			Payment.find({event: event._id}).lean()
				.then(payments => {
					event.payments = payments;
					res.json(event)
				})
				.catch(err => {
					res.json(event)
				})
			
		})
		.catch(err => res.status(500).send(err.message));
	
});