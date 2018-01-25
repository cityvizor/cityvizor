var mongoose = require('mongoose');

var profileSchema = mongoose.Schema({
	
	"status": String,
	
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
	"gps":[Number,Number],
	
	"budgets": [{
		"year": Number,
		"lastCheck": Date,
		"validity": Date
	}],
	
	"contracts": {
		"lastUpdate": Date
	},
	
	"noticeboards": {
		"lastUpdate": Date
	}
	
});
profileSchema.index({ url: 1 });

module.exports = mongoose.model('Profile', profileSchema);