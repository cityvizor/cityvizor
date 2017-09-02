
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
			callback(null, makeCSVLine([profile._id,profile.url,profile.name,profile.ico,profile.zuj,profile.gps[0],profile.gps[1],profile.edesky,profile.mapasamospravy]));
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

function makeCSVLine(array){
	
	// clean and format values
	array = array.map(value => makeCSVItem(value));
	
	return array.join(";") + "\r\n";
}

function makeCSVItem(value){
	
	// number, replace , to . and no quotes
	if(typeof(value) === 'number' || (typeof(value) === 'string' && value.match(/^\d+([\.,]\d+)?$/))){
		 value = value + "";
		 return value.replace(",",".");
	}
	
	// boolean, replace to binary 0/1
	if(typeof(value) === "boolean") return value ? 1 : 0;
		
	// empty values
	if(Number.isNaN(value)) return "";
	
	// string, escape quotes and encapsulate in quotes
	value = value + "";
	return "\"" + value.replace("\"","\"\"") + "\"";
	
}


