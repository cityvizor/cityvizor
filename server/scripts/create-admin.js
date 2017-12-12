var config = require("../config/config.js");

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/' + config.database.db, { useMongoClient: true });
mongoose.plugin(require('mongoose-write-stream'));
mongoose.plugin(require('mongoose-paginate'));
mongoose.Promise = global.Promise;

var User = require("../models/user");
var bcrypt = require("bcrypt");

console.log("Generating password hash");
bcrypt.hash("admin", 10)
  .then(hash => {

    var userData = {
      "password": hash,
      "managedProfiles": [],
      "roles": ["admin"]
    };

    console.log("Saving user data to database");
  
    User.findOneAndUpdate({"_id": "admin"},userData,{upsert:true})
      .then(() => {
        console.log("Created user admin with password admin.");
        mongoose.disconnect(() => process.exit());
      })
      .catch(err => {
        console.error(err.message);
        mongoose.disconnect(() => process.exit());
      });

  })
  .catch(err => {
    console.error(err.message);
    mongoose.disconnect(() => process.exit());
  });
