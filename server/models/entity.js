var mongoose = require('mongoose');

var entitySchema = mongoose.Schema({
	"_id": String,
	"name": String,
	"gps":[Number,Number],
	"phone": String,
	"email": String,
	"dataBox": String,
	"openHours": {
		"mo":[{from:String,to:String}],
		"tu":[{from:String,to:String}],
		"we":[{from:String,to:String}],
		"th":[{from:String,to:String}],
		"fr":[{from:String,to:String}],
		"sa":[{from:String,to:String}],
		"su":[{from:String,to:String}]
	},
	"ico": String,
	"address": {
		"street": String,
		"streetNo": String,
		"city": String,
		"postalCode": String
	}
});

var Entity = module.exports = mongoose.model('Entity', entitySchema);