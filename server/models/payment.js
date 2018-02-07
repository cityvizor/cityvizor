var mongoose = require('mongoose');

// make mongoose create used models
require("./profile");
require("./etl");
require("./event");

var paymentSchema = mongoose.Schema({
	profile: {type: mongoose.Schema.Types.ObjectId, ref: "Profile"},
	year: Number,
	etl: {type: mongoose.Schema.Types.ObjectId, ref: "ETL"},
	event: {type: mongoose.Schema.Types.ObjectId, ref: "Event"},
	type: String,
	item: String,
	paragraph: String,
	date: Date,
	amount: Number,
	counterpartyId: String,
	counterpartyName: String,
	description: String
});
paymentSchema.index({ profile: 1, event: 1 });
paymentSchema.index({ profile: 1, event: 1, year: 1 });
paymentSchema.index({ profile: 1, date: 1 });
paymentSchema.index({ counterpartyId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);