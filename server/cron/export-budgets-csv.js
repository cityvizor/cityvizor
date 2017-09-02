
var fs = require("fs");
var path = require("path");
var parse = require("csv-parse");

var config = require("../config/config");
var importConfig = require("../config/import-config.js");

var destDir = path.join(__dirname,"/../../",config.storage.exportsDir);
var srcDir = path.join(__dirname,"/../../",config.storage.importsDir);

module.exports = function(cb){

	var srcFiles = fs.readdirSync(srcDir);

	var exports = [];
	var exportIndex = {};

	// sort files by type and year
	srcFiles.forEach(file => {
		var matches = file.match(/^([a-h0-9]{24})\-(\d{4})\.(data|events)\.csv$/);
		if(!matches) return;

		var profileId = matches[1];
		var year = Number(matches[2]);
		var type = matches[3];
		
		if(["data","events"].indexOf(type) === -1) return;

		var id = year + "-" + type;

		if(!exportIndex[id]) {
			exportIndex[id] = {year:year,type:type,files:[]};
			exports.push(exportIndex[id]);
		}

		exportIndex[id].files.push({profileId:profileId,name:file});

	});

	exportLoop(exports,() => {
		cb();
	});

}	

function exportLoop(exports,cb){

	var params = exports.shift();

	if(!params) return cb();

	/* TARGET FILE */
	var destName = "budgets-" + params.year + "." + params.type + ".csv";
	var destPath = path.join(destDir,destName);
	var destFile = fs.createWriteStream(destPath);

	destFile.on("close",() => {
		console.log("Exported " + destName);
		exportLoop(exports,cb);
	});

	/* MAPPING */
	var headerNames = importConfig[params.type].headerNames;

	/* HEADER */
	var headerLine = ["profile"];
	Object.keys(headerNames).forEach(key => {
		headerLine.push(key);
	});

	//write header
	destFile.write(makeCSVLine(headerLine));

	/* DATA */
	joinLoop(params.files,headerNames,destFile,() => {
		destFile.end();
	});


}

function joinLoop(files,headerNames,destFile,cb){

	// get current file metadata
	var file = files.shift();
	if(!file) return cb();

	// load file
	var srcFile = fs.createReadStream(path.join(srcDir,file.name));

	// on file end continue with next file
	srcFile.on("close",() => joinLoop(files,headerNames,destFile,cb))

	// get parser
	var parser = parse({delimiter: ';',trim:true});

	var isHeader = true;
	var headerMap;

	parser.on("data", srcLine => {

		if(isHeader){
			headerMap = makeHeaderMap(headerNames,srcLine)
			isHeader = false;
			return;			
		}

		var destLine = [file.profileId];

		Object.keys(headerMap).forEach(key => {
			destLine.push(headerMap[key] >= 0 ? srcLine[headerMap[key]] : "");
		});

		// write to destination file
		destFile.write(makeCSVLine(destLine));

	});

	// feed data to the parser
	srcFile.pipe(parser);

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
	if(Number.isNaN(value)) return "";
	
	// string, escape quotes and encapsulate in quotes
	value = value + "";
	return "\"" + value.replace("\"","\"\"") + "\"";
	
}

function makeHeaderMap(headerNames,header){

	var headerMap = {};

	Object.keys(headerNames).forEach(field => {

		let columnNames = headerNames[field];

		headerMap[field] = -1;

		let search = columnNames.some(name => {
			headerMap[field] = header.indexOf(name);
			if(headerMap[field] >= 0) return true;
		});

	});

	return headerMap;
}