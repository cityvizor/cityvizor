var express = require('express');
var router = express.Router();

var acl = require("../acl/index");

var User = require("../models/user");

var bcrypt = require("bcrypt");

router.get("/", acl("users","list"), (req,res) => {

	var options = {};
	if(req.query.profile) options.managedProfiles = req.query.profile;
	
	User.find(options).select("_id")
		.then(users => users.map(user => user._id))
		.then(users => res.json(users));

});

router.get("/:id", acl("users","read"), (req,res) => {

	User.find({}).select("_id managedProfiles roles")
		.then(users => users.map(user => user._id))
		.then(users => res.json(users));

});


module.exports = router;