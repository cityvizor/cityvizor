var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/supervizor-plus');

var Profile = require("../server/models/profile");
var Entity = require("../server/models/entity");

Profile.remove({},(err) => {
	var testProfile = new Profile({
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
	});

	testProfile.save((err) => {
		console.log("Profile saved",err);
	});

});

var User = require("../server/models/user");
var bcrypt = require("bcrypt");

bcrypt.hash("heslo", 10).then(hash => {
	User.remove({}).then((err) => {
		var testUser = new User({
			"_id": "user@example.com",
			"password": hash,
			"managedProfiles": ["586c306447d31f11fdda05cb"],
			"roles": ["profile-manager"]
		});

		testUser.save((err) => console.log("User saved",err))
	});
});