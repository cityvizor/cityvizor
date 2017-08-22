var express = require('express');
var app = express();

var router = express.Router();
module.exports = router;

var acl = require("express-dynacl");

var Profile = require("../models/profile");

var profileSchema = {
	type: "object",
	properties: {
		"sort": {type: "string"},
		"fields": {type: "string"},
		"hidden": {type: "string"}
	}	
};

router.get("/", acl("profiles","list"), (req,res) => {
	
	var query = Profile.find();
	
	query.select(req.query.fields || "id name url active gps image");
	
	if(req.query.sort) query.sort(req.query.sort);
	
	if(!req.query.hidden) query.where({active: true});
	
	query
		.then(profiles => res.json(profiles))
		.catch(err => res.status(500).send(err.message));
	
});

router.get("/:profile", acl("profiles","read"), (req,res) => {
	
	var where = {};
	
	// if :profile could be ObjectId, then try to match _id too, otherwise match only url / it is not possible to try to match _id when :profile doesnt look like ObjectId
	if(req.params.profile.match(/^[0-9a-fA-F]{24}$/)) where["$or"] = [{url:req.params.profile},{_id:req.params.profile}];
	else where.url = req.params.profile;
	
	Profile.findOne(where).exec((err, profile) => {
		if(err) return res.sendStatus(500);
		if(!profile) return res.sendStatus(404);
		res.json(profile);
	});
});

router.post("/", acl("profiles","write"), (req,res) => {
	
	Profile.create(req.body)
		.then(profile => res.json(profile))
		.catch(err => res.status(500).send(err.message));

});

router.post("/:profile", acl("profiles","write"), (req,res) => {
	
	Profile.findOneAndUpdate({_id:req.params.profile}, req.body, {new:true, runValidators: true})
		.then(profile => res.json(profile))
		.catch(err => res.status(500).send(err.message));

});