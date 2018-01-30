
var async = require("async");

var ETL = require("../models/etl");
var Importer = require("../import/importer");

module.exports = function(cb){

	console.log("Autoimport started!");

	ETL.find({ "enabled": true }).populate("profile","_id name")
		.then(etls => async.mapSeries(etls,runImport,err => finishImport(err,cb)))
		.catch(err => cb(err));
}

function runImport(etl,cb) {
	console.log("=====");
	console.log("Starting autoimport for profile " + etl.profile.name + ", year " + etl.year);

	var importer = new Importer(etl);
	importer.autoImport = true;
	
	var options = {};

	importer.importUrl((err,result) => {
		if(err) console.log("Error: " + err.message);
		else console.log(result);
		cb();
	});
}

function finishImport(err,cb){
	console.log("======");
	console.log("Finished all!"); 	
	cb(err);
}