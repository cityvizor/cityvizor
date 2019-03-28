var mongoose = require('mongoose');

var Profile = require("../models/profile");

var etlSchema =  mongoose.Schema({
	"profile": {type: mongoose.Schema.Types.ObjectId, ref: "Profile"},
	"year": {type: Number, required: true},
	"visible": Boolean,
	
	"enabled": Boolean,
	"importer": String,
	"dataFile": String,
	"eventsFile": String,
	"delimiter": String,

	"status": String,
	"error": String,
	"validity": Date,
	"lastCheck": Date,
	"lastModified": Date,
	"etag": String,
	"warnings": [String],

});
etlSchema.index({ profile: 1, year: -1 }, {unique: true});
etlSchema.index({ profile: 1, visible: 1 });

module.exports = mongoose.model('ETL', etlSchema);