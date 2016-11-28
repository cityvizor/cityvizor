var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	"login": String,
	"password": String,
	"managedEntities": [String],
	"roles": [String]
});

var User = module.exports = mongoose.model('User', userSchema);