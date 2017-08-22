
var archiver = require("archiver");
var fs = require("fs");
var path = require("path");

var Budget = require("../models/expenditures").Budget;

var config = require("../config/config");

module.exports = function(cb){

	var path = path(__dirname,"/../../",config.export.saveDir,'/budgets.json.zip');
	var file = fs.createWriteStream(path);
	
	file.on("close",() => {
		console.log("Budgets exported to " + path);
		cb();
	});

	var archive = archiver("zip");
	archive.on('error', err => {
		console.log("Error: " + err);
		cb();
	});
	archive.pipe(file);
	
	

	Budget.find({}).populate("profile","name url entity")
		.then(items => {
			items.forEach(item => archive.append(JSON.stringify(item),{"name": item.profile._id + "-" + item.year + ".json"}));
			archive.finalize();
		})
		.catch(err => {
			console.log("Error: " + err.message);
			cb();
		});

}