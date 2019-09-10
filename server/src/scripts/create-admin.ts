import { UserRecord } from "../schema/database";

import { db, dbDisconnect } from "../db";

var bcrypt = require("bcryptjs");

(async function () {

  console.log("Generating password hash...");

  const hash = await bcrypt.hash("admin", 10);

  console.log("Deleting admin user data from database...");
  const oldAdmin: UserRecord = await db<UserRecord>("app.users").where({ login: "admin" }).first();
  if (oldAdmin) {
    await db("app.user_roles").where({ userId: oldAdmin.id }).delete();
    await db("app.users").where({ id: oldAdmin.id }).delete();
  }

  console.log("Saving admin user data to database...");

  const userData = {
    "login": "admin",
    "password": hash,
  };

  const id = await db("app.users").insert(userData, ["id"]).then(rows => rows[0].id)

  const roleData = {
    "userId": id,
    "role": "admin"
  };

  await db("app.user_roles").insert(roleData);


  console.log("Created user admin with password admin.");

  dbDisconnect();

})();