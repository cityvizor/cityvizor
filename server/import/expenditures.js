var fs = require("fs");
var parse = require("csv-parse");
var ExpenditureTransformer = require ("./expenditures-transformer.js");
var ExpenditureDBWriter = require ("./expenditures-dbwriter.js");

var ExpendituresSchema = require("../models/expenditures");
var Budget = ExpendituresSchema.Budget;
var EventBudget = ExpendituresSchema.EventBudget;

/**
	* Expenditures and budget data importer
	* @param filePath CSV file to be imported, UTF-8, separated by semicolon (;)
	* @param profileId The ID of profile into which the data should be imported
	* @param year The year that the data apply to (it is not possible to import any other time range than entire year
	**/
module.exports = function(filePath, profileId, year){

	// Open the file and set automatic delete on file close (we dont want to save the file)
	var file = fs.createReadStream(filePath);
	file.on("close",() => fs.unlink(filePath));
	
	// Parser to parse CSV file
	var parser = parse({delimiter: ';'/*,columns:true*/});

	// Transformer to convert 2D CSV structure to JSON tree. Takes CSV source row by row and returns the whole data bundle at end.
	var transformer = new ExpenditureTransformer(profileId, year);
	
	// Write JSON tree to MongoDB database
	var dbwriter = new ExpenditureDBWriter(profileId,year);
	
	// Clear old data. We always replace entire year block of data. Data is intentionally partitioned in DB to make this easy.
	var clearOld = [];
	clearOld.push(Budget.remove({profileId:profileId,year:year}));
	clearOld.push(EventBudget.remove({profileId:profileId,year:year}));
	// TODO: clearOld.push(EventInvoices.remove({profileId:profileId,year:year}));
	
	// After all clearing finished, launch the import
	Promise.all(clearOld).then(errs => {
		
		// TODO: If clearing fails, cancel import (and possibly revert???)
		// TODO: if(errs.some(item => item)) { }

		// Launch the import by piping all the streams together
		file.pipe(parser).pipe(transformer).pipe(dbwriter);

	});
	
}