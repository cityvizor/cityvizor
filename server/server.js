var http = require('http');
var https = require('https');
var fs = require('fs');
var express = require('express');

var config = require("./config/config.js");

if(config.cron.enable){
	setTimeout(() => require("./cron"),20000);
}

/* SET UP ROUTING */
var app = express();
console.log("Express running in " + app.get('env') + " environment");

if(config.server.compression){
	var compression = require('compression');
	app.use(compression());
}

var bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support urlencoded bodies

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/' + config.database.db);
mongoose.plugin(require('mongoose-write-stream'));
mongoose.plugin(require('mongoose-paginate'));
mongoose.Promise = global.Promise;

/* Mongo Express */
if(config.mongoExpress.enable){
	var mongo_express = require('mongo-express/lib/middleware');
	var mongo_express_config = require('./config/mongo-express-config.js');
	app.use('/db', mongo_express(mongo_express_config))
}

if(config.api.enable){
	app.use("/api",require("./routers/api.js"));
}

if(config.ui.enable){
	app.use(require("./routers/static"));
}


/* SET UP SERVER */
if(config.ssl.enable){
	// start https server
	https.createServer(config.ssl, app).listen(443, function () {
		console.log('CityVizor Server listening on port 443!')
	});

	// Redirect from http port 80 to https
	http.createServer(function (req, res) {
		res.writeHead(301, { "Location": "https://" + req.headers.host + req.url });
		res.end();
	}).listen(config.server.port, function () {
		console.log('CityVizor Server redirecting from port ' + config.server.port + ' to 443!')
	});
}

else {
	app.listen(config.server.port, function () {
		console.log('CityVizor Server listening on port ' + config.server.port + '!');
	});
}