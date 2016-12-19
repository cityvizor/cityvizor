var express = require('express');
var app = express();

var router = express.Router();
module.exports = router;

var acl = require("../acl/index");

var Profile = require("../models/profile");

var acl = require("../acl/index");

router.get("/", acl("profile","list"), (req,res) => {
	Profile.find({}).select("id name entity").populate("entity","id name gps").exec((err, profiles) => {
		if (err) return res.next(err);
		res.json(profiles);
	});
});

router.get("/:id", acl("profile","read"), (req,res) => {
	Profile.findOne({_id:req.params.id}).populate("entity").exec((err, profile) => {
		if (err) return res.next(err);
		res.json(profile); // TODO: co kdyz neexistuje
	});
});

router.post("/:id", acl("profile","write"), (req,res) => {
	
	// entity is mean to be saved by reference to Entity collection and we dont want this reference to be overwritten by the actual entity data
	if(req.body.entity && req.body.entity._id) req.body.entity = req.body.entity._id;
	
	Profile.findOneAndUpdate({_id:req.params.id}, req.body, {new:true, upsert:true, runValidators: true}, (err, profile) => {
		if(err) req.next(err);
		else res.json(profile);
	});
});