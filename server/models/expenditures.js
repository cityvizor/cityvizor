var mongoose = require('mongoose');

require("./profile");
require("./entity");

var budgetSchema = mongoose.Schema({
	profile: {type: mongoose.Schema.Types.ObjectId, ref: "Profile"},
	year: String,
	budgetAmount: Number,
	expenditureAmount: Number,
	paragraphs: [{
		id: String,
		events: [{
			event: String,
			name: String,
			budgetAmount: Number,
			expenditureAmount: Number,
		}],
		budgetAmount: Number,
		expenditureAmount: Number
	}]
});

var eventSchema = mongoose.Schema({
	profile: {type: mongoose.Schema.Types.ObjectId, ref: "Profile"},
	id: String,
	name: String,
	budgetAmount: Number,
	expenditureAmount: Number,
	gps: [Number,Number]
});

var eventBudgetSchema = mongoose.Schema({	
	event: String,
	profile: {type: mongoose.Schema.Types.ObjectId, ref: "Profile"},
	year: Number,
	paragraphs: [{
		id: String,
		budgetAmount: Number,
		expenditureAmount: Number
	}],
	items: [{
		id: String,
		budgetAmount: Number,
		expenditureAmount: Number
	}],
	budgetAmount: Number,
	expenditureAmount: Number
});

var invoiceSchema = mongoose.Schema({
	profile: {type: mongoose.Schema.Types.ObjectId, ref: "Profile"},
	event: String,
	year: Number,
	item: String,
	paragraph: String,
	date: Date,
	amount: Number,
	counterpartyId: String,
	counterpartyName: String,
	description: String
});

module.exports = {
	"Budget": mongoose.model('Budget', budgetSchema),
	"Event": mongoose.model('Event', eventSchema),
	"EventBudget": mongoose.model('EventBudget', eventBudgetSchema),
	"Invoice": mongoose.model('Invoice', invoiceSchema)
};