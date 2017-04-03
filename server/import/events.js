var csvParse = require("csv-parse");
var fs = require("fs");

var BatchStream = require("batch-stream");

const Writable = require('stream').Writable;
const Transform = require('stream').Transform;

var Event = require("../models/expenditures").Event;

module.exports = function(filePath, profileId){

	var file = fs.createReadStream(filePath);
	file.on("close",() => fs.unlink(filePath));
	
	var parser = csvParse({
		delimiter: ';',
		columns:true,
		relax_column_count:true
	});
	
	var transformer = new Transform({
		objectMode: true,
		transform: function(entity, encoding, callback) {
			callback(null,{
				"profile": profileId,
				"event": entity["ORJ"],
				"name": entity["ORJ_NAZEV"]
			});
		}
	});
	
	var batch = new BatchStream({ size : 500 });
	
	var dbWriter = new Writable({
		objectMode: true,
		write: function(entities, encoding, callback){
			
			Event.insertMany(entities)
				.then(entities => {
					console.log(entities.length + " events imported");
					callback();
				});
			
		}
	});

	Event.remove({profile:profileId}).then(err => {
		
		file.pipe(parser).pipe(transformer).pipe(batch).pipe(dbWriter);	
		
	});
}