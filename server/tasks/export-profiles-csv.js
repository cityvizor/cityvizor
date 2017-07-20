
var archiver = require("archiver");
var fs = require("fs");

var Profile = require("../models/profile");

var config = require("../config/config");

module.exports = function(cb){

	var path = __dirname + "/../../" + config.export.saveDir + '/profiles.csv.zip';
	var file = fs.createWriteStream(path);
	
	file.on("close",() => {
		
		console.log("Profiles exported to " + path);

		cb();
	
	});

	var archive = archiver("zip");
	archive.on('error', err => {throw err;});
	archive.pipe(file);

	Profile.find({}).select("url name entity").lean()
		.then(profiles => {

			// create header
			let csv = "url;name;entity\r\n";
		
			//add data
			profiles.forEach(profile => {
				csv = csv + [profile.url,profile.name,profile.entity].map(item => "\"" + item + "\"").join(";") + "\r\n";
			});

			//archive
			archive.append(csv,{"name": "profiles.csv"});
			archive.finalize();
		});
}


