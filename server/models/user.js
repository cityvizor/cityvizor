var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	"_id": String,
	"password": String,
	"managedProfiles": [String],
	"roles": [String]
});

module.exports = mongoose.model('User', userSchema);