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
	
	budget: {
		budgetAmount: Number,
		expenditureAmount: Number,
		groups: [{
			id: String,
			name: String,
			budgetAmount: Number,
			expenditureAmount: Number
		}],
		paragraphs: [{
			id: String,
			group: Number,
			name: String,
			budgetAmount: Number,
			expenditureAmount: Number
		}]
	}
});

module.exports = mongoose.model('Expenditures', expendituresSchema);