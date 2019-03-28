var express = require('express');
var router = express.Router();

var schema = require('express-jsonschema');
var acl = require("express-dynacl");
var bcrypt = require("bcryptjs");

var User = require("../models/user");

var usersSchema = {};

router.get("/", schema.validate({query: usersSchema}), acl("users","list"), (req,res) => {

	User.find({}).select("_id name organization roles")
		.then(users => res.json(users))
		.catch(err => res.status(500).send(err.message));

});

var userSchema = {};

router.get("/:id", schema.validate({query: userSchema}), acl("users","read"), (req,res) => {

	User.findOne({_id:req.params.id}).populate("managedProfiles","_id name")
		.then(user => res.json(user))
		.catch(err => res.status(500).send(err.message));

});

var userPostSchema = {
	type: "object",
	properties: {
		"_id": {type: "string"},
		"password": {type: "string"}
	}
}

router.post("/:id", schema.validate({body: userPostSchema}), acl("users","write"), (req,res) => {

	var _id = req.params.id.toLowerCase();
	req.body._id = _id;
	
	// if there is password in the payload, hash it with bcrypt
	var passwordHash = new Promise((resolve,reject) => {
		if(req.body.password){
			bcrypt.hash(req.body.password, 10).then(hash => {
				req.body.password = hash;
				resolve(req.body);
			});
		}
		else resolve(req.body);
	});
		
	passwordHash.then(body => {
		User.findOneAndUpdate({_id:_id},body,{upsert:true,new:true}).populate("managedProfiles","_id name")
			.then(user => res.json(user))
			.catch(err => res.status(500).send(err.message));
	});

});

router.delete("/:id", acl("users","delete"), (req,res) => {

	User.remove({_id:req.params.id.toLowerCase()})
		.then(() => res.sendStatus(200))
		.catch(err => res.status(500).send(err.message));

});


module.exports = router;