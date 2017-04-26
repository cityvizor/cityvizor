var express = require('express');
var app = express();

var router = express.Router();
module.exports = router;

var acl = require("express-dynacl");

var Profile = require("../models/profile");

router.get("/", acl("profiles","list"), (req,res) => {
	
	var where = {};
	
	if(!req.query.hidden) where.active = true;
	
	Profile.find(where).select("id name url entity active").populate("entity","id name gps").exec((err, profiles) => {
		if (err) return res.next(err);
		res.json(profiles);
	});
	
});

router.get("/:profile", acl("profiles","read"), (req,res) => {
	
	var where = {};
	
	// if :profile could be ObjectId, then try to match _id too, otherwise match only url / it is not possible to try to match _id when :profile doesnt look like ObjectId
	if(req.params.profile.match(/^[0-9a-fA-F]{24}$/)) where["$or"] = [{url:req.params.profile},{_id:req.params.profile}];
	else where.url = req.params.profile;
	
	if(!req.query.hidden) where.active = true;
	
	console.log(where);
	
	Profile.findOne(where).populate("entity").exec((err, profile) => {
		if(err) return res.sendStatus(500);
		if(!profile) return res.sendStatus(404);
		res.json(profile);
	});
});

router.post("/:profile", acl("profiles","write"), (req,res) => {
	
	Profile.findOneAndUpdate({_id:req.params.profile}, req.body, {new:true, runValidators: true}).populate("entity")
		.then(profile => res.json(profile))
		.catch(err => res.sendStatus(500));

});