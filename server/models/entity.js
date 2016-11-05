var mongoose = require('mongoose');

var entitySchema = mongoose.Schema({
	"name": String,
	"ico": String,
	"typ": String,
	"views": {
		"informace": Boolean,
		"vydaje": Boolean,
		"uredni-deska": Boolean,
		"prezkum-hospodareni": Boolean
	},
	"data": {
		"uredni-deska": Number
	}
});

var Entity = module.exports = mongoose.model('Entity', entitySchema);

Entity.remove({}, (err) => {
	var testEntity = new Entity({
		"name": "Nové Město na Moravě",
		"ico": "00294900",
		"typ": "obec",
		"views": {
			"informace": true,
			"vydaje": true,
			"uredni-deska": true,
			"prezkum-hospodareni": false
		},
		"data": {
			"uredni-deska": 227
		}
	});

	testEntity.save();

});