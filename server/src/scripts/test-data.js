var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cityvizor');

var Profile = require("../server/models/profile");
var Entity = require("../server/models/entity");

var User = require("../server/models/user");
var bcrypt = require("bcrypt");

var queries = [];

queries[0] = new Promise((resolve, reject) => {
	var testProfile = {
		"_id": "586c306447d31f11fdda05cb",
		"url": "nmnm",
		"name": "Nové Město na Moravě",
		"entity": "596230",
		"modules": {
			"dash-board": true,
			"expenditure-viz": true,
			"expenditure-events": true,
			"notice-board": true,
			"management-review": true,
			"data-sources": true
		},
		"data": {
			"modules": {
				"uredni-deska": {
					id: 227
				},
				"vydaje":{
					"mapa": true
				}
			}
		}
	};

	Profile.findOneAndUpdate(testProfile,{upsert:true})
		.then(() => console.log("Profile nmnm saved"))
		.then(resolve)
		.catch(err => console.log(err))
		.catch(reject);

});

queries[1] = new Promise((resolve, reject) => {

	bcrypt.hash("heslo", 10).then(hash => {
		
		var user1 = {
			"password": hash,
			"managedProfiles": ["586c306447d31f11fdda05cb"],
			"roles": ["profile-manager"]
		};

		User.findOneAndUpdate({"_id": "user@example.com"},user1,{upsert:true})
			.then(() => console.log("User user@example.com saved"))
			.then(resolve)
			.catch(err => console.log(err))
			.catch(reject);
	});

});

queries[2] = new Promise((resolve, reject) => {

	bcrypt.hash("admin", 10).then(hash => {
		
		var user2 = {
			"password": hash,
			"managedProfiles": [],
			"roles": ["admin"]
		};

		User.findOneAndUpdate({"_id": "admin@example.com"},user2,{upsert:true})
			.then(() => console.log("User admin@example.com saved"))
			.then(resolve)
			.catch(err => console.log(err))
			.catch(reject);

	});
	
});

Promise.all(queries).then(() => {
	console.log("Done.");
	mongoose.disconnect();
});



