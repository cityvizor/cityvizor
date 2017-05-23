
var archiver = require("archiver");
var fs = require("fs");

var Profile = require("../models/profile");

var exportsDir = __dirname + "/../../exports";

module.exports = function(cb){

	var path = exportsDir + '/profiles.csv.zip';
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
			let csv = "url;name;entity\r\n";g
		
			//add data
			profiles.forEach(profile => {
				csv = csv + [profile.url,profile.name,profile.entity].map(item => "\"" + item + "\"").join(";") + "\r\n";
			});

			//archive
			archive.append(csv,{"name": "profiles.csv"});
			archive.finalize();
		});
}


