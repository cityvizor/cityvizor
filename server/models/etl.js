var mongoose = require('mongoose');

var importLogSchema = mongoose.Schema({
	"profile": {type: mongoose.Schema.Types.ObjectId, ref: "Profile"},
	"year": Number,
	"validity": Date,
	
	"date": Date,
	"user": {type: String, ref: "User"},
	
	"type": String,
	"autoImport": {type: mongoose.Schema.Types.ObjectId, ref: "AutoImport"},
	"srcFiles": String,
	
	"result": String,
	"warnings": [String],
	"error":String
		
});

var autoImportSchema = mongoose.Schema({
	"profile": {type: mongoose.Schema.Types.ObjectId, ref: "Profile"},
	"year": Number,
	
	"type": String,
	"settings": mongoose.Schema.Types.Mixed
});

module.exports = {
	"ImportLog": mongoose.model('ImportLog', importLogSchema),
	"AutoImport": mongoose.model('AutoImport', autoImportSchema)
};