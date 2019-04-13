var mongoose = require('mongoose');

require("./profile");
require("./etl");

var counterpartySchema = mongoose.Schema({
	profile: {type: mongoose.Schema.Types.ObjectId, ref: "Profile"},
	etl: {type: mongoose.Schema.Types.ObjectId, ref: "ETL"},
	year: Number,
	counterpartyId: String,
	name: String,
	budgetExpenditureAmount: Number,  
	budgetIncomeAmount: Number,
	expenditureAmount: Number,
	incomeAmount: Number
});

counterpartySchema.set('collection', 'counterparties');

counterpartySchema.index({ counterpartyId: 1, name: 1, amount: 1 });
counterpartySchema.index({ name: "text" });

module.exports = mongoose.model('Counterparty', counterpartySchema);