var mongoose = require('mongoose');

require("./etl");
require("./profile");
require("./user");

var etlLogSchema = mongoose.Schema({
  "profile": {type: mongoose.Schema.Types.ObjectId, ref: "Profile"},
  "etl": {type: mongoose.Schema.Types.ObjectId, ref: "ETL"},
  "timestamp": Date,
	"user": {type: String, ref: "User"},
	"autoImport": Boolean,

  "statusCode": Number,
  "statusMessage": String,
  "error": String,
  
  "validity": Date,
  "lastModified": Date,
	"etag": String,

  "source": String,
  
  "warnings": [String]
});

module.exports = mongoose.model('ETLLog', etlLogSchema);