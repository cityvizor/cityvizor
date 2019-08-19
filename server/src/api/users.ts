import express from 'express';

import schema from 'express-jsonschema';
import acl from "express-dynacl";
import bcrypt from "bcryptjs";

import config from "../../config";
import { db } from '../db';
import { UserRecord } from '../schema';

export const router = express.Router();

router.get("/", acl("users", "list"), async (req, res, next) => {

	const users = await db<UserRecord>("users").select("id", "login", "name", "email", "organization");
	res.json(users);

});

router.get("/:id", acl("users", "read"), async (req, res, next) => {

	const user = await db<UserRecord>("users")
		.select("id", "login", "name", "email", "organization")
		.where({ id: req.params.user })
		.first();

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

	userData.password = await bcrypt.hash(userData.password, 10);

	const id = await db("users").insert(userData, ["id"]).then(result => result[0].id);

	res.location = config.apiRoot + "/users/" + id;
	res.sendStatus(201);
});

router.patch("/:user", acl("users", "write"), async (req, res, next) => {

	const userData: Partial<UserRecord> = req.body;

	if (userData.password) userData.password = await bcrypt.hash(userData.password, 10);

	await db("users")
		.where({ id: req.params.user })
		.update(userData);
	
	res.sendStatus(204);
});

router.delete("/:user", acl("users", "delete"), async (req, res, next) => {

	await db("users").where({ id: req.params.user }).delete();

	res.sendStatus(204);

});