var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/supervizor-plus');

var Entity = require("../server/models/entity");

Entity.find({}).select("ico")
	.then(entities => {
	
		var promises = [];
		var i = 0;
	
		entities.forEach(entity => {
			entity.ico = ("00000000" + entity.ico).slice(-8);
			promises.push(entity.save(() => {
				i++;
				if(i % 100 === 0) console.log(i);
			}));

		});
	
		Promise.all(promises).then(() => {
			console.log("finished");
			process.exit(0);
		});
});