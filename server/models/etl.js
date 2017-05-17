var mongoose = require('mongoose');

var etlSchema = mongoose.Schema({
	"profile": {type: mongoose.Schema.Types.ObjectId, ref: "Profile"},
	"year": Number,
	"valid": Date,
	
	"date": Date,
	"user": {type: String, ref: "User"},
	"target": String,
	"file": String,	
	
	"status": String,
	"result": String,
	"warnings": [String],
	
	"note": String
		
});

var ETL = module.exports = mongoose.model('ETL', etlSchema);