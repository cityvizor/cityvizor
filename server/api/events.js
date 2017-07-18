var express = require('express');	
var router = express.Router();

var schema = require('express-jsonschema');
var acl = require("express-dynacl");

var Event = require("../models/expenditures").Event;
var Payment = require("../models/expenditures").Payment;

var eventsSchema = {};

router.get("/", schema.validate({query: eventsSchema}), acl("events", "list"), (req,res) => {
	Event.find({}, (err,item) => res.json(item));
});

var eventSchema = {};

router.get("/:id", schema.validate({query: eventSchema}), acl("events", "read"), (req,res) => {
	
	Event.findOne({_id:req.params.id}).lean()
		.then(event => {
			
			Payment.find({event: event._id}).lean()
				.then(payments => {
					event.payments = payments;
					res.json(event)
				})
				.catch(err => {
					res.json(event)
				})
			
		})
		.catch(err => res.status(500).send(err));
	
});

module.exports = router;