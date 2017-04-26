var express = require('express');
var router = express.Router();

var acl = require("express-dynacl");
var bcrypt = require("bcrypt");

var User = require("../models/user");

router.get("/", acl("users","list"), (req,res) => {

	User.find({}).select("_id name organization roles")
		.then(users => res.json(users));

});

router.get("/:id", acl("users","read"), (req,res) => {

	User.findOne({_id:req.params.id}).populate("managedProfiles","_id name")
		.then(user => res.json(user));

});

router.post("/:id", acl("users","write"), (req,res) => {

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
		User.findOneAndUpdate({_id:req.params.id},body,{upsert:true,new:true}).populate("managedProfiles","_id name")
			.then(user => res.json(user))
			.catch(err => res.sendStatus(500));
	});

});

router.delete("/:id", acl("users","delete"), (req,res) => {

	User.remove({_id:req.params.id})
		.then(() => res.sendStatus(200))
		.catch(err => res.sendStatus(500));

});


module.exports = router;