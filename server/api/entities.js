var express = require('express');
var app = express();

var router = express.Router();
module.exports = router;

var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

var acl = require("express-dynacl");

var Entity = require("../models/entity");
var EntityImport = require("../import/entities");

router.get("/", acl("entity","read"), (req,res) => {
	var query = Entity.find({}).select("id name").limit(100);
	
	if(req.params.skip) query.skip(req.params.skip);
	
	query.exec((err, entities) => {
		if (err) return res.next(err);
		res.json(entities);
	});
});

router.post("/", acl("entity","write"), upload.single('file'), (req,res) => {

	if(req.file.path){
		console.log(req.file);
		EntityImport(req.file.path);
		res.sendStatus(200);
	}
	else {
		res.sendStatus(500);
	}
	
});

router.get("/:id", acl("entity","read"), (req,res) => {
	Entity.findOne({_id:req.params.id})
		.then((entity) => {
			if(entity) res.json(entity);
			else res.sendStatus(404);
		})
		.catch(err => res.next(err));
});

