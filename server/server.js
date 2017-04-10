var http = require('http');
var https = require('https');
var fs = require('fs');
var express = require('express');

/* SET UP ROUTING */
var app = express();
console.log("Express running in " + app.get('env') + " environment");

var compression = require('compression');
app.use(compression());

var bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cityvizor');
mongoose.plugin(require('mongoose-write-stream'));
mongoose.Promise = global.Promise;

app.use("/api",require("./routers/api.js"));

app.use(require("./routers/static"));

app.get('*',(req,res) => {
	res.sendFile("build/index.html", { root: __dirname + "/.." });	
});

/* SET UP SERVER */
// get SSL certificates
const options = {
	cert: fs.readFileSync('./cert/fullchain.pem'),
	key: fs.readFileSync('./cert/privkey.pem')
}; 	

// start https server
https.createServer(options, app).listen(443, function () {
	console.log('CityVizor Server listening on port 443!')
});

// Redirect from http port 80 to https
http.createServer(function (req, res) {
	res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
	res.end();
}).listen(80, function () {
	console.log('CityVizor Server redirecting from port 80 to 443!')
});