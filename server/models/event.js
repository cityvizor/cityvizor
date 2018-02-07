var mongoose = require('mongoose');

// make mongoose create used models
require("./profile");
require("./etl");

var eventSchema = mongoose.Schema({
	profile: {type: mongoose.Schema.Types.ObjectId, ref: "Profile"},
	year: Number,
	etl: {type: mongoose.Schema.Types.ObjectId, ref: "ETL"},
	srcId: String,
	name: String,
	description: String,
	gps: [Number,Number],
	paragraphs: [{
		id: String,
		budgetExpenditureAmount: Number,
		budgetIncomeAmount: Number,
		expenditureAmount: Number,
		incomeAmount: Number
	}],
	items: [{
		id: String,
		budgetExpenditureAmount: Number,
		budgetIncomeAmount: Number,
		expenditureAmount: Number,
		incomeAmount: Number
	}],
	budgetExpenditureAmount: Number,
	budgetIncomeAmount: Number,
	expenditureAmount: Number,
	incomeAmount: Number
});
eventSchema.index({ profile: 1, event: 1 });
eventSchema.index({ profile: 1, name: 1 });

module.exports = mongoose.model('Event', eventSchema);