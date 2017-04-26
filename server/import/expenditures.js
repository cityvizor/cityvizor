var fs = require("fs");
var parse = require("csv-parse");
var ExpenditureTransformer = require ("./expenditures-transformer.js");

var ExpendituresSchema = require("../models/expenditures");
var Budget = ExpendituresSchema.Budget;
var EventBudget = ExpendituresSchema.EventBudget;
var Invoice = ExpendituresSchema.Invoice;

var ETL = require("../models/etl");

/**
	* Expenditures and budget data importer
	* @param filePath CSV file to be imported, UTF-8, separated by semicolon (;)
	* @param profileId The ID of profile into which the data should be imported
	* @param year The year that the data apply to (it is not possible to import any other time range than entire year
	**/
module.exports = function(filePath, profileId, year){
	
	return new Promise((resolve,reject) => {

		var etlLog = new ETL();
		etlLog.target = "expenditures";
		etlLog.profile = profileId;
		etlLog.status = "pending";
		etlLog.date = new Date(),
		etlLog.save(() => resolve(etlLog));
								
		// couter of written documents to DB
		var counter = {
			eventBudgets: 0,
			budgets: 0,
			invoices: 0
		};

		// Open the file and set automatic delete on file close (we dont want to save the file)
		var file = fs.createReadStream(filePath);
		file.on("error",() => fs.unlink(filePath));
		file.on("close",() => fs.unlink(filePath));

		// Parser to parse CSV file
		var parser = parse({delimiter: ';',trim:true});

		// Transformer to convert 2D CSV structure to JSON tree. Takes CSV source row by row and returns the whole data bundle at end.
		var transformer = new ExpenditureTransformer(profileId, year);

		transformer.on("writeDB",(type,count) => counter[type] += count);

		transformer.on("warning", warning => etlLog.warnings.push(warning));

		transformer.on("error", e => {
			etlLog.status = "error";
			etlLog.errors.push({name:e.name,message:e.message});
			etlLog.save();
		});	

		transformer.on("closeDB", () => {
			etlLog.status = "success";
			etlLog.result = "Úspěšně nahráno " + counter.invoices + " faktur, " + counter.eventBudgets + " rozpočtů investičních akcí a " + counter.budgets + " rozpočet obce";
			etlLog.save();
		});

		// Clear old data. We always replace entire year block of data. Data is intentionally partitioned in DB to make this easy.
		var clearOld = [];
		clearOld.push(Budget.remove({profile:profileId,year:year}));
		clearOld.push(EventBudget.remove({profile:profileId,year:year}));
		clearOld.push(Invoice.remove({profile:profileId,year:year}));

		// After all clearing finished, launch the import
		Promise.all(clearOld).then(errs => {

			// TODO: If clearing fails, cancel import (and possibly revert???)
			// TODO: if(errs.some(item => item)) { }

			// Launch the import by piping all the streams together
			file.pipe(parser).pipe(transformer);//.pipe(dbwriter);

		});
	});
	
}