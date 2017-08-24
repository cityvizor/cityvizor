var mongoose = require('mongoose');

var profileSchema = mongoose.Schema({
	
	"active": Boolean,
	"hiddenModules": [String],
	
	"url": {type: String, index: true },
	"name": String,
	"email": String,
	"avatarExt": String,
	
	"zuj": String,
	"ico": String,
	"dataBox": String,
	"edesky": Number,
	"mapasamospravy": Number,
	"gps":[Number,Number]
});

module.exports = mongoose.model('Profile', profileSchema);