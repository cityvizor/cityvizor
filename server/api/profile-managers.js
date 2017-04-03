var express = require('express');	
var app = express();

var router = express.Router({mergeParams: true});

var acl = require("../acl/index");

var User = require("../models/user");

router.get("/", acl("profile-managers","list"), (req,res) => {
	
  if(!req.params.profile) return res.status(400).send("Bad Request (missing profile parameter)");
  
	User.find({managedProfiles:req.params.profile}).select("_id")
		.then(users => users.map(user => user._id))
		.then(users => res.json(users));

});

module.exports = router;