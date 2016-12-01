var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/supervizor-plus');

var Expenditures = require("../server/models/expenditures");

Expenditures.find({}, "ico year", function(err, items) {
	console.log("Found following expenditure documents:");
	var i = 0;
	items.forEach((item) => {
		i++;
		console.log(i + ") ICO: " + item.ico + ", YEAR: " + item.year);
	});
	console.log("Deleting...");

	Expenditures.remove({}, (err) => {
		console.log("All expenditures deleted!");
		process.exit();
	}); 

});

