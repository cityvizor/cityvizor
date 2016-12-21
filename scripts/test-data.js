var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/supervizor-plus');

var Profile = require("../server/models/profile");
var Entity = require("../server/models/entity");

Entity.remove({}).then((err) => {
	var testEntity = new Entity({
		"_id": "596230",
		"name": "Nové Město na Moravě",
		"gps": [16.074221,49.561482]
	});

	testEntity.save((err) => {
		
		console.log("Entity saved",err);
		
		Profile.remove({},(err) => {
			var testProfile = new Profile({
				"_id": "nmnm",
				"name": "Nové Město na Moravě",
				"entity": "596230",
				"modules": {
					"informace": true,
					"vydaje": true,
					"prijmy": true,
					"uredni-deska": true,
					"prezkum-hospodareni": true
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
			});

			testProfile.save((err) => {
				console.log("Profile saved",err);
			});

		});

	})

});

var User = require("../server/models/user");
var bcrypt = require("bcrypt");

bcrypt.hash("heslo", 10).then(hash => {
	User.remove({}).then((err) => {
		var testUser = new User({
			"_id": "user@example.com",
			"password": hash,
			"managedProfiles": ["nmnm"],
			"roles": ["profile-manager"]
		});

		testUser.save((err) => console.log("User saved",err))
	});
});