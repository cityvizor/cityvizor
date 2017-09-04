var mongoose = require('mongoose');

var profileSchema = mongoose.Schema({
	
	"active": Boolean,
	"hiddenModules": [String],
	
	"url": String,
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
eventSchema.index({ url: 1 });

module.exports = mongoose.model('Profile', profileSchema);