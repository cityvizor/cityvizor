var mongoose = require('mongoose');

var budgetSchema = mongoose.Schema({
	entityId: String,
	year: String,
	budgetAmount: Number,
	expenditureAmount: Number,
	paragraphs: [{
		id: String,
		name: String,
		events: [{
			id: String,
			name: String,
			event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
			budgetAmount: Number,
			expenditureAmount: Number
		}],
		budgetAmount: Number,
		expenditureAmount: Number
	}]
});

var eventSchema = mongoose.Schema({
	entityId: String,
	id: String,
	name: String,
	yearData: [{
		year: Number,
		paragraphs: [{
			id: String,
			budgetAmount: Number,
			expenditureAmount: Number
		}],
		/*invoices: [{
			amount: Number
		}],*/
		budgetAmount: Number,
		expenditureAmount: Number
	}],
	budgetAmount: Number,
	expenditureAmount: Number,
	gps: [Number,Number]
});

module.exports = {
	"Budget": mongoose.model('Budget', budgetSchema),
	"Event": mongoose.model('Event', eventSchema)
};