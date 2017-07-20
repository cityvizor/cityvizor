
var archiver = require("archiver");
var fs = require("fs");

var config = require("../config/config");

module.exports = function(cb){

	var savePath = __dirname + "/../../" + config.export.saveDir + '/events.csv.zip';
	var loadPath = __dirname + "/../../" + config.import.saveDir + "/events";
	var file = fs.createWriteStream(savePath);
	
	file.on("close",() => {
		console.log("Events exported to " + savePath);
		cb();
	});

	var archive = archiver("zip");
	archive.on('error', err => {
		console.log("Error: " + err);
		cb();
	});
	archive.pipe(file);
	
	console.log("Archiving imports from " + loadPath)
	archive.directory(loadPath, false);
	
	archive.finalize();

}