var mongoose = require('mongoose');

require("./profile");

var budgetSchema = mongoose.Schema({
	profile: {type: mongoose.Schema.Types.ObjectId, ref: "Profile"},
	year: String,
	validity: Date,
	budgetExpenditureAmount: Number,
	budgetIncomeAmount: Number,
	expenditureAmount: Number,
	incomeAmount: Number,
	paragraphs: [{
		id: String,
		events: [{
			event: String,
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
			event: String,
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

var eventSchema = mongoose.Schema({
	profile: {type: mongoose.Schema.Types.ObjectId, ref: "Profile"},
	srcId: String,
	year: Number,
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

var paymentSchema = mongoose.Schema({
	profile: {type: mongoose.Schema.Types.ObjectId, ref: "Profile"},
	year: Number,
	event: {type: mongoose.Schema.Types.ObjectId, ref: "Event"},
	type: String,
	item: String,
	paragraph: String,
	date: Date,
	amount: Number,
	counterpartyId: {type:String, index:true},
	counterpartyName: String,
	description: String
});
paymentSchema.index({ profile: 1, event: 1 });
paymentSchema.index({ profile: 1, event: 1, year: 1 });

module.exports = {
	"Budget": mongoose.model('Budget', budgetSchema),
	"Event": mongoose.model('Event', eventSchema),
	"Payment": mongoose.model('Payment', paymentSchema)
};