var mongoose = require('mongoose');

var profileSchema = mongoose.Schema({
	"active": Boolean,
	"url": {type: String, index: true },
	"name": String,
	"email": String,
	"entity": { type: mongoose.Schema.Types.String, ref: 'Entity' },
	"hiddenModules": [String]
});

module.exports = mongoose.model('Profile', profileSchema);