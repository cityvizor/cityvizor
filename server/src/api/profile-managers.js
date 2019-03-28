var express = require('express');	
var app = express();

var router = express.Router({mergeParams: true});

var acl = require("express-dynacl");

var User = require("../models/user");

router.get("/", acl("profile-managers","list"), (req,res) => {
	
	var where = {
		$or: [
			{roles: "profile-manager", managedProfiles: req.params.profile},
			{roles: "admin"}
		]
	};
	
	User.find(where).select("_id name organization")
		.then(users => res.json(users));

});

module.exports = router;