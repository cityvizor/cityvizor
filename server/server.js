var http = require('http');
var https = require('https');
var fs = require('fs');
var express = require('express');

var config = require("./config/config.js");

/* SET UP ROUTING */
var app = express();
console.log("Express running in " + app.get('env') + " environment");

if(config.server.compression){
	var compression = require('compression');
	app.use(compression());
}

// parse body
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support urlencoded bodies

var mongoose = require('mongoose');
mongoose.plugin(require('mongoose-write-stream'));
mongoose.plugin(require('mongoose-paginate'));
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/' + config.database.db, { useMongoClient: true })
	.then(() => console.log("Connected to database " + config.database.db))
	.catch(err => {
		throw new Error("Error when connectiong to DB " + config.database.db + ": " + err.message); // if not connected the app will not throw any errors when accessing DB models, better to fail hard and fix
	});




// configure express-jwt
var jwt = require('express-jwt');
app.use(jwt(config.jwt));

// configure DynACL
var acl = require("express-dynacl");
var aclOptions = {
	roles: {
		"guest": require("./acl/guest"),
		"user": require("./acl/user"),
		"profile-manager": require("./acl/profile-manager"),
		"profile-admin": require("./acl/profile-admin"),
		"admin": require("./acl/admin")
	},
	defaultRoles: ["guest"],
	userRoles: ["user"],
	logConsole: true
}
acl.config(aclOptions);

/* Mongo Express Database viewer */
if(config.mongoExpress.enable){
	var mongo_express = require('mongo-express/lib/middleware');
	var mongo_express_config = require('./config/mongo-express-config.js');
	app.use('/db', mongo_express(mongo_express_config))
	console.log("Mongo Express accessible at /db");
}

/* SET UP ROUTES */
// api routes
app.use("/api",require("./routers/api"));

// serve static files
app.use(require("./routers/static"));

app.use((err, req, res, next) => {

	if (err.name === 'UnauthorizedError') {
		res.status(err.status);
		res.send("Unauthorized" + (err.message ? ": " + err.message : ""));
	}

	else if (err.name === 'JsonSchemaValidation') {
		console.log("API Error: " + err.message);
		console.log(err.validations.query);
		res.status(400).send("API Error: " + err.message);
	}

	else next(err);

});


/* SET UP SERVER */
let host = config.server.host || "127.0.0.1";
let port = config.server.port || 80;

if(config.ssl.enable){

	// start https server
	https.createServer(config.ssl, app).listen(443, host, function () {
		console.log('CityVizor Server listening on ' + host + ':443!')
	});

	let redirectPort = config.ssl.redirectPort || port || 80;

	// Redirect to https
	if(config.ssl.redirect && redirectPort){		
		http.createServer(function (req, res) {
			res.writeHead(301, { "Location": "https://" + req.headers.host + req.url });
			res.end();
		}).listen(redirectPort, host, function () {
			console.log('CityVizor Server redirecting from ' + host + ':' + port + ' to ' + host + ':443!')
		});
	}

}

else {

	http.createServer(app).listen(port, host, function () {
		console.log('CityVizor Server listening on ' + host + ':' + port + '!');
	});

}
