var express = require('express');
var router = module.exports = express.Router();

var schema = require('express-jsonschema');
var acl = require("express-dynacl");

var User = require("../models/user");

var bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');

var config = require("../config/config.js");

function createToken(user,validity,callback){
	
	// set the token contents
	var tokenData = {
		_id: user._id	,
		managedProfiles: user.managedProfiles,
		roles: user.roles
	};

	// set validity
	var tokenOptions = {
		expiresIn: validity
	};

	jwt.sign(tokenData, config.jwt.secret, tokenOptions, callback);

}

var loginSchema = {
	type: "object",
	properties: {
		"login": {type: "string", required: true},
		"password": {type: "string", required: true}
	}	
};

router.post("/", schema.validate({body: loginSchema}), acl("login","login"), (req,res) => {

	User.findOne({_id:req.body.login.toLowerCase()}).select("+password").then((user) => {

		if(!user) return res.status(404).send("User not found");

		bcrypt.compare(req.body.password, user.password, (err, same) => {
			
			if(err){
				res.status(500).send("Unexpected error when validating the password.");
			}
			else if(same){
				createToken(user,"1 day",(err,token) =>{
					if(err) res.status(500).send("Unexpected error when creating token.");
					else if(token) res.send(token)
				});
			}
			else {
				res.status(401).send("Wrong password for user \"" + user._id + "\".");
			}
			
		});
		
	});
});

router.get("/renew",acl("login","renew"), (req,res) => {
	
	// we get the data from DB so we can update token data if something changed (e.g. roles)
	User.findOne({_id:req.user._id}).then((user) => {
		createToken(user,"1 day",(err,token) => res.send(token));
	});
	
});
