var mongoose = require('mongoose');

var entitySchema = mongoose.Schema({
	"_id": String,
	"name": String,
	"gps":[]
});

var Entity = module.exports = mongoose.model('Entity', entitySchema);