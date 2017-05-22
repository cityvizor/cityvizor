var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var archiver = require("archiver");
var fs = require("fs");	

var Entity = require("../models/entity");

var exportsDir = __dirname + "/../../exports";

module.exports = function(cb){
	
	mongoose.connect('mongodb://localhost/cityvizor');
	console.log("DB connected.");

	var path = exportsDir + '/entities.json.zip';
	var file = fs.createWriteStream(path);
	
	file.on("close",() => {
		
		console.log("Entities exported to " + path);
		
		mongoose.disconnect(() => {
			console.log("DB disconnected.");
			cb();
		});
		cb();
		
	});

	var archive = archiver("zip");
	archive.on('error', err => {throw err;});
	archive.pipe(file);

	Entity.find({}).then(items => {
		archive.append(JSON.stringify(items),{"name": "entities.json"});
		archive.finalize();
	});

}

