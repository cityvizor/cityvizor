var express = require('express');
var app = express();

var router = express.Router();
module.exports = router;

var acl = require("../acl/index");

var sget = require("simple-get");

var Profile = require("../models/profile");
var Entity = require("../models/entity");

function getIDs(profileId){
	return new Promise((resolve,reject) => {

		Profile
			.findOne({_id:profileId})
			.select("entity")
			.populate("entity","_id edesky mapasamospravy")
			.exec((err,profile) => {
				if(profile) resolve(profile.entity);
				else reject(err);
			});
	});
}

router.get("/", acl("edesky","list"), (req,res) => {
	Entity.find({}).select("_id name edesky mapasamospravy")
		.then(list => res.json(list))
		.catch(err => res.sendStatus(500));	
});

router.get("/:id/ids", acl("edesky","read"), (req,res) => {
	getIDs(req.params.id).then(ids => res.json(ids)).catch(err => {
		res.sendStatus(404);
	});
});

router.get("/:id/list", acl("edesky","read"), (req,res) => {
	
	getIDs(req.params.id)
		.then((ids) => {

			var params = [
				["created_from", "2016-06-01"],
				["dashboard_id", ids.edesky],
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
		})
		.catch(err => res.sendStatus(404));

});

router.get("/:id/preview/:document", acl("edesky","read"), (req,res) => {

	var path = 'https://edesky.cz/dokument/' + req.params.document + '.txt';
	
	sget(path, (err,sres) => {
		if(err) res.sendStatus(sres.statusCode);
		else {
			res.type("text/plain");
			sres.pipe(res);
		}
	});
	
});


