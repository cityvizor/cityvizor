var mongoose = require('mongoose');

var etlSchema = mongoose.Schema({
	"profile": {type: mongoose.Schema.Types.ObjectId, ref: "Profile"},
	"year": Number,
	"date": Date,
	"status": String,
	
	"user": {type: String, ref: "User"},
	
	"target": String,
	"file": String,	
	
	"result": String,
	"warnings": [String],
	
	"note": String
		
});

var ETL = module.exports = mongoose.model('ETL', etlSchema);