var express = require('express');
var app = express();
console.log("Express running in " + app.get('env') + " environment");

var bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.plugin(require('mongoose-write-stream'));
mongoose.connect('mongodb://localhost/cityvizor');

var mongo_express = require('mongo-express/lib/middleware');
var mongo_express_config = require('./mongo-config.js');
app.use('/db', mongo_express(mongo_express_config))

app.use("/api",require("./routers/api.js"));

app.use(require("./routers/static"));

app.get('*',(req,res) => {
	res.sendFile("src/index.html", { root: __dirname + "/.." });	
});

app.listen(8080, function () {
	console.log('CityVizor Server listening on port 8080!')
})