var mongoose = require('mongoose');

var expendituresSchema = mongoose.Schema({
	ico: String,
	year: String,
	events: [{
		id: String,
		name: String,
		paragraphs: [{
			id: String,
			budgetAmount: Number,
			expenditureAmount: Number
		}],
		budgetAmount: Number,
		expenditureAmount: Number,
		gps: [Number,Number]
	}],
	budgetAmount: Number,
	expenditureAmount: Number,
	paragraphs: [{
		id: String,
		group: Number,
		name: String,
		budgetAmount: Number,
		expenditureAmount: Number
	}]
});

var Expenditures = module.exports = mongoose.model('Expenditures', expendituresSchema);