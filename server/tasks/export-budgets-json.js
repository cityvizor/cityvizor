var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var archiver = require("archiver");
var fs = require("fs");

var Budget = require("../models/expenditures").Budget;

var exportsDir = __dirname + "/../../exports";

module.exports = function(cb){
	
	mongoose.connect('mongodb://localhost/cityvizor');
	console.log("DB connected.");
	
	var path = exportsDir + '/budgets.json.zip';
	var file = fs.createWriteStream(path);
	
	file.on("close",() => {
		console.log("Budgets exported to " + path);
		
		mongoose.disconnect(() => {
			console.log("DB disconnected.");
			cb();
		});
		
	});

	var archive = archiver("zip");
	archive.on('error', err => {throw err;});
	archive.pipe(file);

	Budget.find({}).populate("profile","name url entity")
		.then(items => {
			items.forEach(item => archive.append(JSON.stringify(item),{"name": item.profile._id + "-" + item.year + ".json"}));
			archive.finalize();
		});

}