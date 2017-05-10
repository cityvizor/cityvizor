var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/cityvizor');

var fs = require("fs");

var Profile = require("../server/models/profile");
var ETL = require("../server/models/etl");
var importer = require("../server/import/expenditures");

var dir = "uploads/expenditures";

function reImportLoop(files,cb){

	let file = files.pop();
	
	if(!file) return cb();
	
	let path = dir + "/" + file.file;
	
	let etlLog = new ETL();
	etlLog.target = "expenditures";
	etlLog.profile = file.profile;
	etlLog.status = "pending";
	etlLog.date = new Date();
	etlLog.file = file.originalname;
	etlLog.user = "automat";
	etlLog.year = file.year;
	etlLog.note = "Automatický reimport dat z důvodu změn v interní struktuře databáze.";
	etlLog.save()
		.then(etlLog => {
		
			console.log("Reimporting profile " + file.profile + ", year " + file.year);
								
			// reimport expenditures
			importer(path,file.profile,file.year,etlLog)
				.then(etlLog => {
					console.log("Reimported, result: " + etlLog.result);					
					// go to next file
					reImportLoop(files,cb);
				})
				.catch(etlLog => {
					console.log("Error: " + etlLog.result);
					// go to next file
					reImportLoop(files,cb);
				});
		});
	
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
	

