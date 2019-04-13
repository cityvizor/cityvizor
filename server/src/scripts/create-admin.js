const mongoose = require("../db");

var User = require("../models/user");
var bcrypt = require("bcryptjs");

console.log("Generating password hash...");
bcrypt.hash("admin", 10)
  .then(hash => {

    var userData = {
      "password": hash,
      "managedProfiles": [],
      "roles": ["admin"]
    };

    console.log("Saving user data to database...");

    User.findOneAndUpdate({ "_id": "admin" }, userData, { upsert: true })
      .then(() => {
        console.log("Created user admin with password admin.");
        mongoose.disconnect(() => process.exit());
      })
      .catch(err => {
        console.error("Error: " + err.message);
        mongoose.disconnect(() => process.exit());
      });

  })
  .catch(err => {
    console.error("Error: " + err.message);
    mongoose.disconnect(() => process.exit());
  });
