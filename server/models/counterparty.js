var mongoose = require('mongoose');

require("./profile");
require("./etl");

var counterpartySchema = mongoose.Schema({
	profile: {type: mongoose.Schema.Types.ObjectId, ref: "Profile"},
	etl: {type: mongoose.Schema.Types.ObjectId, ref: "ETL"},
	year: Number,
	counterpartyId: String,
	name: String,
	amount: Number
});

counterpartySchema.set('collection', 'counterparties');

counterpartySchema.index({ id: 1, name: 1, amount: 1 });

var Counterparty = module.exports = mongoose.model('Counterparty', counterpartySchema);