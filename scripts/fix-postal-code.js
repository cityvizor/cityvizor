var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cityvizor');

var Entity = require("../server/models/entity");

Entity.find({})
	.then(entities => {
	
		var queries = [];
	
		entities.forEach(entity => {
			if(entity.address.postalCode.length === 5) {
				var newPSC = entity.address.postalCode.substr(0,3) + " " +  entity.address.postalCode.substr(3);
				entity.address.postalCode = newPSC;
				queries.push(entity.save());
			}
		});
	
		Promise.all(queries).then(() => {
			console.log("finished " + queries.length);
			process.exit(0);
		});
	
	});


