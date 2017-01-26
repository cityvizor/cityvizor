var mongoose = require('mongoose');

var budgetSchema = mongoose.Schema({
	profile: {type: mongoose.Schema.Types.ObjectId, ref: "Profile"},
	year: String,
	budgetAmount: Number,
	expenditureAmount: Number,
	paragraphs: [{
		id: String,
		events: [{
			event: {type: mongoose.Schema.Types.ObjectId, ref: "Event"},
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
	event: {type: mongoose.Schema.Types.ObjectId, ref: "Event"},
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

var eventDocumentSchema = mongoose.Schema({
	profile: {type: mongoose.Schema.Types.ObjectId, ref: "Profile"},
	amount: Number,
	counterpartyId: String,
	counterpartyName: String,
	description: String
});

module.exports = {
	"Budget": mongoose.model('Budget', budgetSchema),
	"Event": mongoose.model('Event', eventSchema),
	"EventBudget": mongoose.model('EventBudget', eventBudgetSchema),
	"EventDocument": mongoose.model('EventDocument', eventBudgetSchema)
};