var mongoose = require('mongoose');

var entitySchema = mongoose.Schema({
	"name": String,
	"ico": String,
	"typ": String,
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

var Entity = module.exports = mongoose.model('Entity', entitySchema);

Entity.remove({}, (err) => {
	var testEntity = new Entity({
		"name": "Nové Město na Moravě",
		"ico": "00294900",
		"typ": "obec",
		"modules": {
			"informace": true,
			"vydaje": true,
			"prijmy": true,
			"uredni-deska": true,
			"prezkum-hospodareni": true
		},
		"data": {
			"modules": {
				"uredni-deska": {
					id: 227
				},
				"vydaje":{
					"mapa": true
				}
			}
		}
	});

	testEntity.save();

});