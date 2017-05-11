var fs = require("fs");
var parse = require("csv-parse");
var ExpenditureTransformer = require ("./expenditures-transformer.js");

var ExpendituresSchema = require("../models/expenditures");
var Budget = ExpendituresSchema.Budget;
var EventBudget = ExpendituresSchema.EventBudget;
var Payment = ExpendituresSchema.Payment;

/**
	* Expenditures and budget data importer
	* @param filePath CSV file to be imported, UTF-8, separated by semicolon (;)
	* @param profileId The ID of profile into which the data should be imported
	* @param year The year that the data apply to (it is not possible to import any other time range than entire year
	**/
module.exports = function(filePath, profileId, year, etlLog){

	return new Promise(function(resolve,reject){
		
		// couter of written documents to DB
		var counter = {
			eventBudgets: 0,
			budgets: 0,
			payments: 0
		};

		// keep track of warnings. we dont want to store them directly to the etlLog, because we want to werite them at the end
		let warnings = [];

		// Open the file and set automatic delete on file close (we dont want to save the file)
		var file = fs.createReadStream(filePath);

		// Parser to parse CSV file
		var parser = parse({delimiter: ';', trim:true, relax_column_count:true});

		parser.on("error",err => {
			// if there hasn't been already some error (error in other piped stream doesn't stop other streams in pipe), then write the error result
			if(!etlLog.error){
				etlLog.status = "error";
				etlLog.result = "Chyba při čtení CSV: " + err.message;
				etlLog.save()
					.then(etlLog => reject(etlLog,err));
			}
		});	

		// Transformer to convert 2D CSV structure to JSON tree. Takes CSV source row by row and writes the whole data bundle to DB at end, meanwhile it writes payments as they go
		var transformer = new ExpenditureTransformer(profileId, year);

		// keep track of how many items have been written
		transformer.on("writeDB",(type,count) => counter[type] += count);

		// save warnings to the ETL document
		transformer.on("warning", warning => warnings.push(warning));

		// listen for errors on the transformation stream
		transformer.on("error", err => {
			// if there hasn't been already some error (error in other piped stream doesn't stop other streams in pipe), then write the error result
			if(!etlLog.error){
				etlLog.status = "error";
				etlLog.result = err.message;
				etlLog.save()
					.then(etlLog => reject(etlLog,err));
			}
		});	

		transformer.on("closeDB", () => {
			// if there hasn't been already some error (error in other piped stream doesn't stop other streams in pipe), then write the error result
			if(!etlLog.error){
				etlLog.status = "success";
				etlLog.result = "Úspěšně nahráno " + counter.payments + " faktur a plateb, " + counter.eventBudgets + " rozpočtů investičních akcí a " + counter.budgets + " rozpočet obce";
				etlLog.warnings = warnings;
				etlLog.save()
					.then(etlLog => resolve(etlLog));
			}
		});

		// Clear old data. We always replace entire year block of data. Data is intentionally partitioned in DB to make this easy.
		var clearOld = [];
		clearOld.push(Budget.remove({profile:profileId,year:year}));
		clearOld.push(EventBudget.remove({profile:profileId,year:year}));
		clearOld.push(Payment.remove({profile:profileId,year:year}));

		// After all clearing finished, launch the import
		Promise.all(clearOld).then(values => {

			// TODO: If clearing fails, cancel import (and possibly revert???)
			// TODO: if(errs.some(item => item)) { }

			// Launch the import by piping all the streams together
			file.pipe(parser).pipe(transformer);//.pipe(dbwriter);

		});
		
	});
}