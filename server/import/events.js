var parse = require("csv-parse");
var fs = require("fs");

var BatchStream = require("batch-stream");

const Writable = require('stream').Writable;
const Transform = require('stream').Transform;

var Event = require("../models/expenditures").Event;
var ETL = require("../models/etl");

var EventTransformer = require("./events-transformer");

module.exports = function(req){

	var filePath = req.file.path;

	var fileName = req.file.originalname;

	var profileId = req.body.profile;

	var year = req.body.year;

	var userId = req.user._id;

	return new Promise((resolve,reject) => {
		
		var etlLog = new ETL();
		etlLog.target = "events";
		etlLog.profile = profileId;
		etlLog.status = "pending";
		etlLog.date = new Date();
		etlLog.file = fileName;
		etlLog.user = userId;
		etlLog.year = year;
		etlLog.valid = req.body.valid;
		etlLog.note = req.body.note;
		etlLog.save(() => resolve(etlLog));

		// couter of written documents to DB
		var counter = 0;
		
		// keep track of warnings. we dont want to store them directly to the etlLog, because we want to werite them at the end
		var warnings = [];

		// stream to read the uploaded file
		var file = fs.createReadStream(filePath);
		file.on("close",() => fs.unlink(filePath));
		file.on("error",() => fs.unlink(filePath));

		// stream to parse CSV
		var parser = parse({delimiter: ';',trim:true});
		
		parser.on("error",err => {
			// if there hasn't been already some error (error in other piped stream doesn't stop other streams in pipe), then write the error result
			if(!etlLog.error){
				etlLog.status = "error";
				etlLog.error = "Chyba při čtení CSV: " + err.message;
				etlLog.save();
			}
		});	

		// stream to map CSV columns to right fields
		var transformer = new EventTransformer(profileId);

		transformer.on("warning", warning => warnings.push(warning));

		transformer.on("error", err => {
			// if there hasn't been already some error (error in other piped stream doesn't stop other streams in pipe), then write the error result
			if(!etlLog.error){
				etlLog.status = "error";
				etlLog.error = "Chyba při zpracování dat: " + err.message;
				etlLog.save();
			}
		});	

		// stream to group events in groups of 500 so that we can insert them to DB in one request
		var batch = new BatchStream({ size : 500 });

		// stream to write events to the database
		var dbWriter = new Writable({
			objectMode: true,
			write: function(entities, encoding, callback){

				this.emit("writeDB",entities.length);
				
				Event.insertMany(entities)
					.then(entities => callback());

			}
		});

		dbWriter.on("writeDB",count => counter += count);

		dbWriter.on("finish", () => {
			etlLog.status = "success";
			etlLog.result = "Úspěšně nahráno " + counter + "  akcí";
			etlLog.warnings = warnings;
			etlLog.save();
		});
		
		dbWriter.on("error", err => {
			// if there hasn't been already some error (error in other piped stream doesn't stop other streams in pipe), then write the error result
			if(!etlLog.error){
				etlLog.status = "error";
				etlLog.error = "Chyba při zápisu do databáze: " + err.message;
				etlLog.save();
			}
		});	
		
		// delete all events from this profile and pipe all the streams together
		Event.remove({profile:profileId}).then(err => {

			file.pipe(parser).pipe(transformer).pipe(batch).pipe(dbWriter);	

		});
	});
}