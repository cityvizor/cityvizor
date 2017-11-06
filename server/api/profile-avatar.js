var express = require('express');	
var app = express();

var router = module.exports = express.Router({mergeParams: true});

var config = require("../config/config");

var multer = require('multer');
var upload = multer({ dest: config.storage.tmpDir });

var fs = require("fs");
var path = require("path");

var acl = require("express-dynacl");

var Profile = require("../models/profile");

router.put("/", upload.single("avatar"), acl("profile-image","write"), (req,res) => {
	
	if(!req.file) return res.status(400).send("Chybí nahrávaný soubor.");
	
	var allowedTypes = [".png",".jpg",".jpe",".gif",".svg"];
	var extname = path.extname(req.file.originalname).toLowerCase();
	
	if(allowedTypes.indexOf(extname) === -1) return res.status(400).send("Nesprávný formát obrázky. Povolené přípony jsou: " + allowedTypes.join(", "));
	
	Profile.findOne({_id:req.params.profile})
		
		.then(profile => {
		
			if(!profile) return res.sendStatus(404);
		
			var fileName = profile._id + extname;
			var filePath = path.join(config.storage.avatarsDir,fileName);
			var oldFilePath = path.join(config.storage.avatarsDir,profile._id + profile.avatarExt);
		
			if(profile.avatarExt && filePath !== oldFilePath) fs.unlink(oldFilePath,err => {});
		
			fs.rename(req.file.path, filePath, (err) => {
				
				if(err) {
					fs.unlink(req.file.path);
					return res.status(500).send(err.message);
				}
				
				// save avatar extenstion (means avatar present and ext known)
				profile.avatarExt = extname;
				profile.save()
					.then(profile => res.sendStatus(200))
					.catch(err => res.status(500).send(err.message));
				
			});
		
		})
		
		.catch(err => {
			res.status(500).send(err.message);
			fs.unlink(req.file.path);
		});

});

router.delete("/",acl("profile-image","write"), (req,res) => {
	Profile.findOne({_id:req.params.profile})
		
		.then(profile => {
		
			if(!profile) return res.sendStatus(404);
			if(!profile.avatarExt) return res.sendStatus(200);
		
			let avatarPath = path.join(config.storage.avatarsDir,profile._id + profile.avatarExt);
		
			fs.unlink(avatarPath, err => {
				if(!err || err.code === "ENOENT"){
					profile.avatarExt = null;
					profile.save()
						.then(profile => res.sendStatus(200))
						.catch(err => res.status(500).send(err.message));
				}
				else{
					res.status(500).send(err.message)
				}
			});
		
			
		
		})
	
		.catch(err => res.status(500).send(err.message));
});
