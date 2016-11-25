var parse = require("csv-parse");
var fs = require("fs");
var ExpenditureTransformer = require ("./expenditure-transformer.js")
var transform = require('stream-transform');

module.exports = function(filePath, ico, year){

	var file = fs.createReadStream(filePath);
	file.on("close",() => fs.unlink(filePath));
	
	var parser = parse({delimiter: ';'});

	var transformer = new ExpenditureTransformer(ico, year);

	var Expenditures = require("../models/expenditures.js");
	
	Expenditures.remove({ico:ico,year:year},(err) => {
		file.pipe(parser).pipe(transformer).pipe(Expenditures.writeStream());
	});
}