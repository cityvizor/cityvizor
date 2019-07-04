const db = require("../db");

var User = require("../models/user");
var bcrypt = require("bcryptjs");

(async function () {

  db.connect();

  console.log("Generating password hash...");

  const hash = await bcrypt.hash("admin", 10);
  
  var userData = {
    "password": hash,
    "managedProfiles": [],
    "roles": ["admin"]
  };

  console.log("Saving user data to database...");

  await User.findOneAndUpdate({ "_id": "admin" }, userData, { upsert: true })

  console.log("Created user admin with password admin.");
  
  await db.mongoose.disconnect();

})();