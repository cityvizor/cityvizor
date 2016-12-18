var mongoose = require('mongoose');

var profileSchema = mongoose.Schema({
	"_id": String,
	"name": String,
	"entity": { type: mongoose.Schema.Types.String, ref: 'Entity' },
	"modules": {
		"informace": Boolean,
		"vydaje": Boolean,
		"prijmy": Boolean,
		"uredni-deska": Boolean,
		"prezkum-hospodareni": Boolean,
		"datove-zdroje": Boolean
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