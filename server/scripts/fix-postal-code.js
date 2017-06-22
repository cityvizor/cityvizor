var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cityvizor');

var Entity = require("../server/models/entity");

Entity.find({})//.limit(5)
	.then(entities => {
	
		var queries = [];
	
		entities.forEach(entity => {
			//console.log(entity.address.postalCode,entity.address.postalCode.replace(" ",""));
			entity.address.postalCode = entity.address.postalCode.replace(" ","");
			queries.push(entity.save());
		});
	
		Promise.all(queries).then(() => {
			console.log("finished " + queries.length);
			process.exit(0);
		});
	
	});


