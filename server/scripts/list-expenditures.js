var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cityvizor');

var Expenditures = require("../server/models/expenditures");

Expenditures.find({year:2016},"ico year budgetAmount expenditureAmount",function(err, items) {
	console.log(items);
	process.exit();
});
