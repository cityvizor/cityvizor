console.log("Starting CityVizor Server");
console.log("Node version: " + process.version);

var http = require('http');
var express = require('express');

var config = require("../config");

/* SET UP ROUTING */
var app = express();

/* CORS FOR DEVELOPMENT */
if(config.cors.enabled){
  const cors = require("cors");
  app.use(cors(config.cors));  
  console.log("[SERVER] CORS enabled" + (config.cors.origin ? " for origin " + config.cors.origin : ""));
}

// polyfill before express allows for async middleware
require('express-async-errors');

if (config.server.compression) {
	var compression = require('compression');
	app.use(compression());
}

// parse body
var bodyParser = require("body-parser");
app.use(bodyParser.json({})); // support json encoded bodies
app.use(bodyParser.urlencoded({
	extended: true,
	limit: "10000kb"
})); // support urlencoded bodies

/* FILE STORAGE */
require("./file-storage");

/* DATABASE */
const { mongoose, connect } = require("./db");
connect();

/* AUTHENTICATION */
var jwt = require('express-jwt');
app.use(jwt(config.jwt), (err, req, res, next) => (err.code === 'invalid_token') ? next() : next(err));

/* ACCESS CONTROL */
var acl = require("express-dynacl");
var aclOptions = {
	roles: {
		"guest": require("./acl/guest"),
		"user": require("./acl/user"),
		"profile-manager": require("./acl/profile-manager"),
		"profile-admin": require("./acl/profile-admin"),
		"importer": require("./acl/importer"),
		"admin": require("./acl/admin")
	},
	defaultRoles: ["guest"],
	userRoles: ["user"],
	logConsole: true
}
acl.config(aclOptions);

/* ROUTING */
app.use(require("./routers"));

// error handling
app.use(require("./middleware/error-handler"));


/* SET UP SERVER */
let host = config.server.host || "127.0.0.1";
let port = config.server.port || 80;

http.createServer(app).listen(port, host, function() {
	console.log('[SERVER] Listening on ' + host + ':' + port + '!');
});
