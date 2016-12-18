var csvParse = require("csv-parse");
var fs = require("fs");

const Transform = require('stream').Transform;
const Writable = require('stream').Writable;

var proj4 = require("proj4");

var Entity = require("../models/entity");

module.exports = function(filePath){

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
			
			if(!entity["ZUJ"]){
				callback();
				return;
			}
			
			var data = {
				"_id": entity["ZUJ"],
				"name": entity["NAZEV_2"],
				"gps": [
					entity["SX"] ? entity["SX"].replace(",",".") : null,
					entity["SY"] ? entity["SY"].replace(",",".") : null
				]
			};
			callback(null,data);
		}
	});

	var GPSConvert = new Transform({
		objectMode: true,
		transform: function(entity, encoding, callback) {
			var fromProjection = "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=3500000 +y_0=0 +ellps=krass +towgs84=26,-121,-78 +units=m +no_defs"; // S-42  -  http://spatialreference.org/ref/sr-org/6636/
			var toProjection = "WGS84";
			
			entity.gps = proj4(fromProjection,toProjection,entity.gps);
			
			callback(null,entity);
		}
	});
	
	var dbWriter = new Writable({
		objectMode: true,
		write: function(entity, encoding, callback){
			
			var id = entity._id;
			delete entity._id;			
			
			Entity.findOneAndUpdate({_id:id},entity,{upsert:true},(err) => callback());
			
		}
	});
	
	Entity.remove({},() => {
		file.pipe(parser).pipe(transformer).pipe(GPSConvert).pipe(dbWriter);
	});
}