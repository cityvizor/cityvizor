var mongoose = require('mongoose');

var contractSchema = mongoose.Schema({
	profile: {type: mongoose.Schema.Types.ObjectId, ref: "Profile", index:true},
	date: Date,
	title: String,
	counterparty: String,
	amount: Number,
	currency: String,
	url: String
});

var Contract = module.exports = mongoose.model('Contract', contractSchema);