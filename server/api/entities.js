var express = require('express');
var app = express();

var router = express.Router();
module.exports = router;

var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

var acl = require("express-dynacl");

var Entity = require("../models/entity");
var EntityImport = require("../import/entities");

//http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
RegExp.escape= function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

router.get("/", acl("entity","list"), (req,res) => {
	
	var where = {};
	if(req.query.search){
		if(req.query.search.name) where.name = new RegExp(RegExp.escape(req.query.search.name),"i");
		if(req.query.search["address.postalCode"]) where["address.postalCode"] = new RegExp(RegExp.escape(req.query.search["address.postalCode"].replace(/ /g,"")),"i");
		if(req.query.search.ico) where.ico = new RegExp(RegExp.escape(req.query.search.ico),"i");
	}
	
	var options = {
		select: req.query.fields || "id name",
		page: Number(req.query.page) || 1,
		limit: Number(req.query.limit) || 100,
		sort: req.query.sort,
	};
	
	Entity.paginate(where,options)
		.then(data => res.json(data))
		.catch(err => res.status(500).send(err));
	
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
		.catch(err => res.sendStatus(500));
});

router.post("/:id", acl("entity","write"), (req,res) => {
	
	req.body.edited = true;
	
	Entity.findOneAndUpdate({_id:req.body._id},req.body,{upsert:true,new:true})
		.then((entity) => res.json(entity))
		.catch(err => res.sendStatus(500));
});


