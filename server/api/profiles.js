var express = require('express');

var router = module.exports = express.Router();

var config = require("../config/config");

var multer = require('multer');
var upload = multer({ dest: config.storage.tmpDir });

var fs = require("fs");
var path = require("path");

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
	
	query.select(req.query.fields || "id name url status gps");
	
	if(req.query.sort) query.sort(req.query.sort);
	
	if(!req.query.hidden) query.where({status: {$ne: "hidden"}});
	
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

router.put("/:profile", acl("profiles","write"), (req,res) => {
	
	Profile.findOneAndUpdate({_id:req.params.profile}, req.body, {new:true, runValidators: true})
		.then(profile => res.json(profile))
		.catch(err => res.status(500).send(err.message));

});

router.get("/:profile/avatar", acl("profile-image","read"), (req,res,next) => {
	
	Profile.findOne({_id:req.params.profile}).select("avatar")
		.then(profile => {
			if(!profile || !profile.avatar) return res.sendStatus(404);
			if(profile.avatar.mime) res.contentType(profile.avatar.mime);
			res.send(profile.avatar.data);
		})
		.catch(err => next(err));
});

router.put("/:profile/avatar", upload.single("avatar"), acl("profile-image","write"), (req,res,next) => {
	
	if(!req.file) return res.status(400).send("Missing file.");
	
	var allowedTypes = [".png",".jpg",".jpe",".gif",".svg"];
	var extname = path.extname(req.file.originalname).toLowerCase();
	
	if(allowedTypes.indexOf(extname) === -1) return res.status(400).send("Allowed file types are: " + allowedTypes.join(", "));
	
	var data = {
		avatar: {
			data: fs.readFileSync(req.file.path),
			type: req.file.mimetype,
			name: req.file.originalname
		}
	};

	Profile.findOneAndUpdate({_id:req.params.profile},data)
		.then(profile => res.sendStatus(200))
		.catch(err => next(err));

});

router.delete("/:profile/avatar",acl("profile-image","write"), (req,res,next) => {
	Profile.findOneAndUpdate({_id:req.params.profile},{avatar:null})
		.then(profile => res.sendStatus(200))
		.catch(err => next(err));
});
