var mongoose = require('mongoose');

// make mongoose create used models
require("./profile");
require("./etl");
require("./event");

var budgetSchema = mongoose.Schema({
	profile: {type: mongoose.Schema.Types.ObjectId, ref: "Profile"},
	year: Number,
	etl: {type: mongoose.Schema.Types.ObjectId, ref: "ETL"},
	
	budgetExpenditureAmount: Number,
	budgetIncomeAmount: Number,
	expenditureAmount: Number,
	incomeAmount: Number,
	paragraphs: [{
		id: String,
		events: [{
			event: {type: mongoose.Schema.Types.ObjectId, ref: "Event"},
			name: String,
			budgetExpenditureAmount: Number,
			expenditureAmount: Number
		}],
		budgetExpenditureAmount: Number,
		expenditureAmount: Number
	}],
	items: [{
		id: String,
		events: [{
			event: {type: mongoose.Schema.Types.ObjectId, ref: "Event"},
			name: String,
			budgetExpenditureAmount: Number,
			budgetIncomeAmount: Number,
			expenditureAmount: Number,
			incomeAmount: Number
		}],
		budgetExpenditureAmount: Number,
		budgetIncomeAmount: Number,
		expenditureAmount: Number,
		incomeAmount: Number
	}]
});
budgetSchema.index({ profile: 1, year: 1 });
budgetSchema.index({ profile: 1, year: 1, validity: 1, budgetExpenditureAmount: 1, budgetIncomeAmount: 1, expenditureAmount: 1, incomeAmount: 1 }, {name:"budgetSchemaStatsIndex"});

module.exports = mongoose.model('Budget', budgetSchema);