
var Transform = require('stream').Transform;
var fs = require("fs");

var Payment = require("../models/expenditures").Payment;

var config = require("../config/config");


module.exports = function(cb){

	Payment.find().distinct("year")
		.then(years => exportLoop(years,cb))
		.catch(err => {
			console.log("Error: " + err.message);
			cb();
		});
	
}


function exportLoop(years,cb){
	
	var year = years.shift();
	
	if(!year) return cb();
	
	// Profiles source stream
	var payments = Payment.find({year:year}).populate("event","_id srcId").lean().cursor();
	
	var header = ['profile','year','event','eventSrcId','type','item','paragraph','date','amount','counterpartyId','counterpartyName','description'];
	
	// convert to CSV
	var transform = new Transform({
		writableObjectMode: true,
		transform(payment, encoding, callback) {
			
			payment.date = payment.date ? payment.date.toISOString() : null;
			if(payment.event){
				payment.eventSrcId = payment.event.srcId;
				payment.event = payment.event._id;
			}
			else{
				payment.eventSrcId = null;
				payment.event = null;
			}

			callback(null, makeCSVLine(header.map(field => payment[field])));
		}
	});
	
	// write to file
	var path = __dirname + "/../../" + config.storage.exportsDir + '/budgets-' + year + '.payments.csv';
	var destFile = fs.createWriteStream(path, {defaultEncoding: 'utf8'});
	// include UTF BOM for MS Excel
	destFile.write("\ufeff");
	

	// end export
	destFile.on("close",() => {
		console.log("Exported " + path);
		exportLoop(years,cb);
	});
	
	// write header
	destFile.write(makeCSVLine(header));
	
	// write rest data
	payments.pipe(transform).pipe(destFile);
	
}

function makeCSVLine(array){
	
	// clean and format values
	array = array.map(value => makeCSVItem(value));
	
	return array.join(";") + "\r\n";
}

function makeCSVItem(value){
	
	// number, replace , to . and no quotes
	if(typeof(value) === 'number' || (typeof(value) === 'string' && value.match(/^\d+([\.,]\d+)?$/))){
		 value = value + "";
		 return value.replace(",",".");
	}
	
	// boolean, replace to binary 0/1
	if(typeof(value) === "boolean") return value ? 1 : 0;
		
	// empty values
	if(Number.isNaN(value) || value === null) return "";
	
	// string, escape quotes and encapsulate in quotes
	value = value + "";
	return "\"" + value.replace("\"","\"\"") + "\"";
	
}