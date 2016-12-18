var express = require('express');
var app = express();

var router = express.Router();
module.exports = router;

var Profile = require("../models/profile");

var acl = require("../acl/index");

router.get("/", acl("profile","get"), (req,res) => {
	Profile.find({}).select("id name entity").populate("entity","id name gps").exec((err, profiles) => {
		if (err) return res.next(err);
		res.json(profiles);
	});
});

router.get("/:id", acl("profile","get"), (req,res) => {
	Profile.findOne({_id:req.params.id}).populate("entity").exec((err, profile) => {
		if (err) return res.next(err);
		res.json(profile); // TODO: co kdyz neexistuje
	});
});

router.post("/:id", acl("profile","update"), (req,res) => {
	Profile.findOneAndUpdate({_id:req.params.id}, req.body, {new:true, upsert:true, runValidators: true}, (err, profile) => {
		if(err) req.next(err);
		else res.json(profile);
	});
});