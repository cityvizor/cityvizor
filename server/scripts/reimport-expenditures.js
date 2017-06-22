var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/cityvizor');

var fs = require("fs");

var config = require("../config/config.js");

var Profile = require("../server/models/profile");
var ExpenditureImporter = require("../import/expenditures");

var argv = require('minimist')(process.argv.slice(2));

var message = argv.m || "Automatický reimport dat z důvodu změn v interní struktuře databáze."

var dir = config.import.saveDir;

function reImportLoop(files,cb){

	let file = files.pop();
	
	if(!file) return cb();
	
	let path = dir + "/" + file.file;
	
	console.log("Reimporting profile " + file.profile + ", year " + file.year);
								
	var importer = new ExpenditureImporter({});
	
	var params = {
		profileId: req.body.profile,
		year: req.body.year,
		validity: req.body.validity,
		eventsFile: req.files.eventsFile[0].path,
		expendituresFile: req.files.expendituresFile[0].path
	};
	
	importer.import(params)
		.then(result => {
			console.log("Reimported, result: " + etlLog.result);					
			// go to next file
			reImportLoop(files,cb);
		})
		.catch(err => {
			console.log("Error: " + etlLog.result);
			// go to next file
			reImportLoop(files,cb);
		}); // TODO PROPER ERROR
	
}
	
var files = fs.readdirSync(dir);

files = files.map(file => {
	let matches = file.match(/^([a-f0-9]{24})\-(\d{4})\.csv$/);
	if(matches) return {profile:matches[1],year:matches[2],file:matches[0]};
	else return null;
});

reImportLoop(files,() => {
	mongoose.disconnect(() => process.exit(0));
});
	
