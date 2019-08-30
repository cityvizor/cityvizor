import express from 'express';

import schema from 'express-jsonschema';
import acl from "express-dynacl";
import bcrypt from "bcryptjs";

import config from "../config";
import { db } from '../db';
import { UserRecord, UserRoleRecord, UserProfileRecord } from '../schema/database';

export const router = express.Router();

router.get("/", acl("users", "list"), async (req, res, next) => {

	const users: any[] = await db<UserRecord>("app.users").select("id", "login");

	const userIndex = {};
	users.forEach(user => {
		userIndex[user.id] = user;
		user.roles = [];
	});

	const userRoles = await db<UserRoleRecord>("app.user_roles").select("userId", "role");
	userRoles.forEach(role => userIndex[role.userId].roles.push(role.role));

	res.json(users);

});

router.get("/:user", acl("users", "read"), async (req, res, next) => {

	const user: any = await db<UserRecord>("app.users")
		.select("id", "login")
		.where(function () {
			this.where({ login: req.params.user })
			if (!isNaN(Number(req.params.user))) this.orWhere({ id: Number(req.params.user) });
		})
		.first();

	if (!user) return res.sendStatus(404);

	user.roles = await db<UserRoleRecord>("app.user_roles")
		.where({ userId: user.id })
		.then(rows => rows.map(row => row.role));

	user.managedProfiles = await db<UserProfileRecord>("app.user_profiles as up")
		.select("p.id as id", "p.name as name")
		.leftJoin("app.profiles as p", { "up.profileId": "p.id" })
		.where({ userId: user.id });

	res.json(user);

});

var userPostSchema = {
	type: "object",
	properties: {
		"login": { type: "string" },
		"password": { type: "string" }
	}
}

router.post("/", schema.validate({ body: userPostSchema }), acl("users", "write"), async (req, res, next) => {

	const userData: Partial<UserRecord> = req.body;

	if (userData.password) userData.password = await bcrypt.hash(userData.password, 10);

	const id = await db("app.users").insert(userData, ["id"]).then(result => result[0].id);

	res.location("/users/" + id);
	res.sendStatus(201);
});

router.patch("/:user", acl("users", "write"), async (req, res, next) => {

	const userData = req.body;

	if (userData.password) userData.password = await bcrypt.hash(userData.password, 10);

	if (userData.roles) {
		const roles = userData.roles.map(role => ({ userId: req.params.user, role: role }));
		delete userData.roles;

		await db("app.user_roles").where({ userId: req.params.user }).delete();
		await db("app.user_roles").insert(roles)
	}

	if (userData.managedProfiles) {
		const managedProfiles = userData.managedProfiles.map(profile => ({ userId: req.params.user, profileId: profile }));
		delete userData.managedProfiles;

		await db("app.user_profiles").where({ userId: req.params.user }).delete();
		await db("app.user_profiles").insert(managedProfiles)
	}

	await db("app.users")
		.where({ id: req.params.user })
		.update(userData);

	res.sendStatus(204);
});

router.delete("/:user", acl("users", "delete"), async (req, res, next) => {

	await db("app.users").where({ id: req.params.user }).delete();

	res.sendStatus(204);

});