var express = require('express');
var app = express();

var router = express.Router();
module.exports = router;

var https = require("https");

router.get("/:id",(req,res) => {

	var params = [
		["created_from", "2016-06-01"],
		["dashboard_id", req.params.id],
		["order", "date"],
		["search_with", "sql"],
		["page", "1"],
	];
	var options = {
		host: 'edesky.cz',
		port: 443,
		path: '/api/v1/documents?' + params.map(item => item[0] + "=" + item[1]).join("&"),
		method: 'GET'
	}
	
	res.type("application/xml");
	
	var edesky_req = https.request(options, edesky_res => {
		var output = '';
		edesky_res.setEncoding('utf8');

		edesky_res.on('data', function (chunk) {
			output += chunk;
		});
		
		edesky_res.on('end', () => res.send(output));
	});

	edesky_req.on('error', function(err) {
		res.next(err);
	});

	edesky_req.end();
});