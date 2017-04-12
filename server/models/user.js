var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	"_id": {type: String, trim: true},
	"email": {type: String, trim: true},
	"password": {type: String, select:false},
	"managedProfiles": [{type: mongoose.Schema.Types.ObjectId, ref: "Profile"}],
	"roles": [String]
});

module.exports = mongoose.model('User', userSchema);