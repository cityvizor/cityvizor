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
	Entity.find({ico:req.params.ico}, (err, entities) => {
		if (err) return res.next(err);
		res.json(entities[0]); // TODO: co kdyz neexistuje
	});
});

module.exports = router;