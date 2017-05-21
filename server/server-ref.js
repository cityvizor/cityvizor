var http = require('http');
var https = require('https');
var fs = require('fs');
var express = require('express');

setTimeout(() => require("./cron"),20000);

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
mongoose.plugin(require('mongoose-paginate'));
mongoose.Promise = global.Promise;

app.use("/api",require("./routers/api.js"));

app.use(require("./routers/static"));

app.get('*',(req,res) => {
	res.sendFile("build/index.html", { root: __dirname + "/.." });	
});

/* START SERVER */
app.listen(8000, function () {
	console.log('CityVizor Server listening on port 8000!');
})