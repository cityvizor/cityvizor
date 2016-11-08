var express = require('express');
var app = express();

var router = express.Router();

var Entity = require("../models/entity");

router.get("/",(req,res) => {
	Entity.find({}, (err, entities) => {
		if (err) return res.next(err);
		res.json(entities);
	});
});

router.get("/:ico",(req,res) => {
	Entity.findOne({ico:req.params.ico}, (err, entity) => {
		if (err) return res.next(err);
		res.json(entity); // TODO: co kdyz neexistuje
	});
});

router.post("/:ico",(req,res) => {
	Entity.findOneAndUpdate({ico:req.params.ico}, req.body, {new:true, upsert:true, runValidators: true}, (err, entity) => {
		if(err) req.next(err);
		else res.json(entity);
	});
});

module.exports = router;