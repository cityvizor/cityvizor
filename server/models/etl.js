var mongoose = require('mongoose');

var entitySchema = mongoose.Schema({
	"_id": String,
	"date": Date,
	"file": String,
	"params": {
		"year": Number,
		"profile": {type: mongoose.Schema.Types.ObjectId, ref: "Profile"}
	},
	"imported": {
		"entity": Number,
		"budget": Number,
		"event": Number,
		"profile": number,
		"user": Number
	},
	"user": {type: String, ref: "User"}
});

var Entity = module.exports = mongoose.model('Entity', entitySchema);