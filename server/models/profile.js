var mongoose = require('mongoose');

var profileSchema = mongoose.Schema({
	"active": Boolean,
	"url": {type: String, index: true },
	"name": String,
	"entity": { type: mongoose.Schema.Types.String, ref: 'Entity' },
	"modules": {
		"expenditure-viz": Boolean,
		"expenditure-events": Boolean,
		"notice-board": Boolean,
		"contract-list": Boolean
	},
	"data": {
		"modules": {
			"uredni-deska": {
				id: Number
			},
			"vydaje":{
				"mapa": Boolean
			}
		}
	}
});

module.exports = mongoose.model('Profile', profileSchema);