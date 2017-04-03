var express = require('express');
var router = express.Router();

var acl = require("express-dynacl");

var User = require("../models/user");

router.get("/", acl("users","list"), (req,res) => {

	var options = {};
	
	User.find({}).select("_id")
		.then(users => users.map(user => user._id))
		.then(users => res.json(users));

});

router.get("/:id", acl("users","read"), (req,res) => {

	User.find({}).select("_id managedProfiles roles")
		.then(users => users.map(user => user._id))
		.then(users => res.json(users));

});


module.exports = router;