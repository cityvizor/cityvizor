var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var archiver = require("archiver");
var fs = require("fs");

var Profile = require("../models/profile");

var exportsDir = __dirname + "/../../exports";

module.exports = function(cb){
	
	//mongoose.connect('mongodb://localhost/cityvizor');
	//console.log("DB connected.");

	var path = exportsDir + '/profiles.json.zip';
	var file = fs.createWriteStream(path);
	
	file.on("close",() => {
		
		console.log("Profiles exported to " + path);
		
		/*mongoose.disconnect(() => {
			console.log("DB disconnected.");
			cb();
		});*/
		cb();
	
	});

	var archive = archiver("zip");
	archive.on('error', err => {throw err;});
	archive.pipe(file);

	Profile.find({}).select("url name entity").then(items => {
		archive.append(JSON.stringify(items),{"name": "profiles.json"});
		archive.finalize();
	});
}


