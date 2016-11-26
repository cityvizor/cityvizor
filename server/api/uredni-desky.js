var express = require('express');
var app = express();

var router = express.Router();
module.exports = router;

var https = require("https");

function sendGET(path,params,success,error){
	
	if(params) path = path + "?" + params.map(item => item[0] + "=" + item[1]).join("&");
	var options = {
		host: 'edesky.cz',
		port: 443,
		path: path,
		method: 'GET'
	}
	
	var edesky_req = https.request(options, edesky_res => {
		var output = '';
		edesky_res.setEncoding('utf8');

		edesky_res.on('data', function (chunk) {
			output += chunk;
		});
		
		edesky_res.on('end', () => success(output));
	});

	edesky_req.on('error', (err) => error(err));

	edesky_req.end();
}

router.get("/",(req,res) => {
	
	sendGET('/api/v1/dashboards',null,(data) => {
		res.type("application/xml");
		res.send(data);
	}, (err) => res.next(err));
	
});
					 
router.get("/:id",(req,res) => {
	
	var params = [
		["created_from", "2016-06-01"],
		["dashboard_id", req.params.id],
		["order", "date"],
		["search_with", "sql"],
		["page", "1"],
	];
	
	sendGET('/api/v1/documents',params,(data) => {
		res.type("application/xml");
		res.send(data);
	}, (err) => res.next(err));
});

router.get("/preview/:document",(req,res) => {

	sendGET('/dokument/' + req.params.document + '.txt',null,(data) => {
		res.type("text/plain");
		res.send(data);
	}, (err) => res.next(err));
	
});
