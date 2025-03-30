import { UserRecord } from "../schema";

import { db, dbDestroy } from "../db";

import { hash as bcrypt_hash } from "bcryptjs";

(async () => {
  console.log("Generating password hash...");

  const hash = await bcrypt_hash("admin", 10);

  console.log("Deleting admin user data from database...");
  const oldAdmin = await db<UserRecord>("app.users")
    .where({ login: "admin" })
    .first();
  if (oldAdmin) {
    await db("app.users").where({ id: oldAdmin.id }).delete();
  }

  console.log("Saving admin user data to database...");

  const userData = {
    login: "admin",
    password: hash,
    role: "admin",
  };

  const id = await db("app.users")
    .insert(userData, ["id"])
    .then(rows => rows[0].id);

  console.log(`Created user admin with password admin. Row id ${id}`);

  await dbDestroy();
})();
