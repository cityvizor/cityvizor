
var Transform = require('stream').Transform;
var fs = require("fs");

var Profile = require("../models/profile");

var config = require("../config/config");


module.exports = function(cb){

	
	// Profiles source stream
	var profiles = Profile.find({}).select("_id url name ico zuj gps edesky mapasamospravy").lean().cursor();
	
	// convert to CSV
	var transform = new Transform({
		writableObjectMode: true,
		transform(profile, encoding, callback) {
			callback(null, [profile._id,profile.url,profile.name,profile.ico,profile.zuj,profile.gps[0],profile.gps[1],profile.edesky,profile.mapasamospravy].map(item => "\"" + item + "\"").join(";") + "\r\n");
		}
	});
	
	// write to file
	var path = __dirname + "/../../" + config.storage.exportsDir + '/profiles.csv';
	var file = fs.createWriteStream(path);

	// end export
	file.on("close",() => {
		console.log("Profiles exported to " + path);
		cb();
	});
	
	// write header
	file.write("_id;url;name;ico;zuj;gps_x;gpx_y;edesky;mapasamospravy\r\n");
	
	// write rest data
	profiles.pipe(transform).pipe(file);
	
}


