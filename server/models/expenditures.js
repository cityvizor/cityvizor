var mongoose = require('mongoose');

var budgetSchema = mongoose.Schema({
	profileId: String,
	year: String,
	budgetAmount: Number,
	expenditureAmount: Number,
	paragraphs: [{
		id: String,
		events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
		budgetAmount: Number,
		expenditureAmount: Number
	}]
});

var eventSchema = mongoose.Schema({
	profileId: String,
	id: String,
	name: String,
	budgetAmount: Number,
	expenditureAmount: Number,
	gps: [Number,Number]
});

var eventBudgetSchema = mongoose.Schema({
	profileId: String,
	eventId: String,
	year: Number,
	paragraphs: [{
		id: String,
		budgetAmount: Number,
		expenditureAmount: Number
	}],
	budgetAmount: Number,
	expenditureAmount: Number
});

module.exports = {
	"Budget": mongoose.model('Budget', budgetSchema),
	"Event": mongoose.model('Event', eventSchema),
	"EventBudget": mongoose.model('EventBudget', eventBudgetSchema)
};