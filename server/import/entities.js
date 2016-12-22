var csvParse = require("csv-parse");
var fs = require("fs");

var BatchStream = require("batch-stream");

const Writable = require('stream').Writable;

var Entity = require("../models/entity");

module.exports = function(filePath){

	var file = fs.createReadStream(filePath);
	file.on("close",() => fs.unlink(filePath));
	
	var parser = csvParse({
		delimiter: ';',
		columns:true,
		relax_column_count:true
	});
	
	var transformer = require("./entities-transformer.js");
	
	var batch = new BatchStream({ size : 500 });
	
	var dbWriter = new Writable({
		objectMode: true,
		write: function(entities, encoding, callback){		
			
			Entity.insertMany(entities,(err) => {
				console.log(entities.length + " entities imported");
				callback();
			});
			
		}
	});
	
	Entity.remove({},() => {
		file.pipe(parser).pipe(transformer).pipe(batch).pipe(dbWriter);
	});
}