var mongoose = require('mongoose');

var profileSchema = mongoose.Schema({
	"url": {type: String, index: true },
	"name": String,
	"entity": { type: mongoose.Schema.Types.String, ref: 'Entity' },
	"modules": {
		"dash-board": Boolean,
		"expenditure-viz": Boolean,
		"expenditure-events": Boolean,
		"notice-board": Boolean,
		"management-review": Boolean,
		"data-sources": Boolean
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