var parse = require("csv-parse");
var fs = require("fs");
var ExpenditureTransformer = require ("./expenditures-transformer.js");
var ExpenditureDBWriter = require ("./expenditures-dbwriter.js");
var transform = require('stream-transform');

module.exports = function(filePath, ico, year){

	var file = fs.createReadStream(filePath);
	file.on("close",() => fs.unlink(filePath));
	
	var parser = parse({delimiter: ';',columns:true});

	var transformer = new ExpenditureTransformer(ico, year);
	
	var dbwriter = new ExpenditureDBWriter(ico,year);

	file.pipe(parser).pipe(transformer).pipe(dbwriter);
}