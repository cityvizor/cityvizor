var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cityvizor-test');

var User = require("../models/user");
var bcrypt = require("bcrypt");

bcrypt.hash("admin", 10).then(hash => {

	var adminUser = {
		"password": hash,
		"roles": ["admin"]
	};

	User.findOneAndUpdate({"_id": "admin"},adminUser,{upsert:true})
		.then(() => {
			console.log("Created/replaced user admin with password admin and role admin.");
			process.exit();
		})
		.catch(err => console.log(err));
});
