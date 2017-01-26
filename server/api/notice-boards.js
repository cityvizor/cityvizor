var express = require('express');
var app = express();

var router = express.Router();
module.exports = router;

var acl = require("../acl/index");

var sget = require("simple-get");

var Profile = require("../models/profile");
var Entity = require("../models/entity");

router.get("/boards", acl("edesky","list"), (req,res) => {
	Entity.find({}).select("_id name edesky mapasamospravy")
		.then(list => res.json(list))
		.catch(err => res.sendStatus(500));	
});

router.get("/boards/:id/list", acl("edesky","read"), (req,res) => {
	
	var params = [
		["created_from", "2016-06-01"],
		["dashboard_id", req.params.id],
		["order", "date"],
		["search_with", "sql"],
		["page", "1"],
	];

	var path = 'https://edesky.cz/api/v1/documents' + "?" + params.map(item => item[0] + "=" + item[1]).join("&");

	sget(path, (err,sres) => {
		if(err) res.sendStatus(sres.statusCode);
		else {
			res.type("application/xml");
			sres.pipe(res);
		}
	});
});

router.get("/preview/:id", acl("edesky","read"), (req,res) => {

	var path = 'https://edesky.cz/dokument/' + req.params.id + '.txt';
	
	sget(path, (err,sres) => {
		if(err) res.sendStatus(sres.statusCode);
		else {
			res.type("text/plain");
			sres.pipe(res);
		}
	});
	
});


