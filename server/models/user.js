var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	"_id": String,
	"password": String,
	"managedProfiles": [{type: mongoose.Schema.Types.ObjectId, ref: "Profile"}],
	"roles": [String]
});

module.exports = mongoose.model('User', userSchema);