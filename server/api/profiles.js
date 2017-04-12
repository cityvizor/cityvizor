var express = require('express');
var app = express();

var router = express.Router();
module.exports = router;

var acl = require("express-dynacl");

var Profile = require("../models/profile");

router.get("/", acl("profiles","list"), (req,res) => {
	Profile.find({}).select("id name url entity").populate("entity","id name gps").exec((err, profiles) => {
		if (err) return res.next(err);
		res.json(profiles);
	});
});

router.get("/:profile", acl("profiles","read"), (req,res) => {
	
	// if :profile could be ObjectId, then try to match _id too, otherwise match only url / it is not possible to try to match _id when :profile doesnt look like ObjectId
	var where = req.params.profile.match(/^[0-9a-fA-F]{24}$/) ? {$or: [{url:req.params.profile},{_id:req.params.profile}]} : {url:req.params.profile};
	
	Profile.findOne(where).populate("entity").exec((err, profile) => {
		if(err) return res.sendStatus(500);
		if(!profile) return res.sendStatus(404);
		res.json(profile);
	});
});

router.post("/:profile", acl("profiles","write"), (req,res) => {
	
	// entity is mean to be saved by reference to Entity collection and we dont want this reference to be overwritten by the actual entity data
	if(req.body.entity && req.body.entity._id) req.body.entity = req.body.entity._id;
	
	Profile.findOneAndUpdate({_id:req.params.profile}, req.body, {new:true, runValidators: true}, (err, profile) => {
		if(err) req.next(err);
		else res.json(profile);
	});
});