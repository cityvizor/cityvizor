var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/supervizor-plus');
mongoose.Promise = global.Promise;

console.log("DB connected.");

var archiver = require("archiver");
var fs = require("fs");

var Budget = require("../server/models/expenditures").Budget;
var Entity = require("../server/models/entity");

var exportsDir = __dirname + "/../exports";

var exports = [];

console.log("Exporting...");

/* BUDGETS */

exports.push(new Promise(function(resolve,reject){
	var file = fs.createWriteStream(exportsDir + '/budgets.zip');
	file.on("close",() => {
		console.log("Budgets exported.");
		resolve();
	});

	var archive = archiver("zip");
	archive.on('error', err => {throw err;});
	archive.pipe(file);

	Budget.find({}).populate("profile","name url entity")
		.then(items => {
		items.forEach(item => archive.append(JSON.stringify(item),{"name": item.profile._id + "-" + item.year + ".json"}));
		archive.finalize();
	});
}));

/* ENTITIES */
exports.push(new Promise(function(resolve,reject){
	var file = fs.createWriteStream(exportsDir + '/entities.zip');
	file.on("close",() => {
		console.log("Entities exported.");
		resolve();
	});
					
	var archive = archiver("zip");
	archive.on('error', err => {throw err;});
	archive.pipe(file);

	Entity.find({}).then(items => {
		archive.append(JSON.stringify(items),{"name": "entities.json"});
		archive.finalize();
	});
}));

/* FINISH SCRIPT */
Promise.all(exports)
	.then(results => {
		console.log("Exporting finished.");
		process.exit(0);
	});


