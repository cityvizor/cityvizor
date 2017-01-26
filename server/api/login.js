var express = require('express');
var router = express.Router();

var acl = require("../acl/index");

var User = require("../models/user");

var bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');

router.post("/", acl("user","login"), (req,res) => {

	User.findOne({_id:req.body.login}).then((user) => {

		if(!user) return res.status(404).send("User not found");

		bcrypt.compare(req.body.password, user.password, (err, same) => {
			if(same){
				
				// we want to send only some values
				var tokenData = {
					_id: user._id	,
					managedProfiles: user.managedProfiles,
					roles: user.roles
				};
				
				// generate token with 1 day validity
				var tokenOptions = {
					expiresIn: "1 day"
				};
				
				jwt.sign(tokenData, "kaj;aliuew ;932fjadkjfp9832jf;dlkj", tokenOptions, (err,token) => {
					
					//send the token to client
					res.send(token);
					
				});
				
			} else {
				res.status(401).send("Wrong password for user \"" + user._id + "\".");
			}
		});
		
	});
});


module.exports = router;