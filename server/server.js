var express = require('express');
var app = express();

var compression = require('compression');
app.use(compression());

var bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/supervizor-plus');
mongoose.plugin(require('mongoose-write-stream'));
mongoose.Promise = global.Promise;

app.use("/api",require("./routers/api.js"));

app.use(require("./routers/static"));

app.get('*',(req,res) => {
	res.sendFile("build/index.html", { root: __dirname + "/.." });	
});

app.listen(80, function () {
	console.log('Supervizor Plus Server listening!')
})