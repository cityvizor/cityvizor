var mongoose = require('mongoose');

var entitySchema = mongoose.Schema({
	"name": String,
	"ico": String,
	"type": String,
	"notice-board": String
});

var Entity = module.exports = mongoose.model('Entity', entitySchema);

Entity.remove({}, (err) => {
	var testEntity = new Entity({
		name: "Nové Město na Moravě",
		ico: "00294900",
		type: "municipality",
		"notice-board":227
	});
	
	testEntity.save();
	
});