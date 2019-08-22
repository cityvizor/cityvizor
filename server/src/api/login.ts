import express from 'express';

import schema from 'express-jsonschema';
import acl from "express-dynacl";

import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export const router = express.Router();

import config from "../../config";
import { db } from '../db';
import { UserRecord, UserProfileRecord, UserRoleRecord } from 'src/schema/database';

async function createToken(tokenData: any, validity): Promise<string> {

	// set validity
	var tokenOptions = {
		expiresIn: validity
	};

	return new Promise((resolve, reject) => jwt.sign(tokenData, config.jwt.secret, tokenOptions, (err, token) => err ? reject(err) : resolve(token)));

}

var loginSchema = {
	type: "object",
	properties: {
		"login": { type: "string", required: true },
		"password": { type: "string", required: true }
	}
};

router.post("/", schema.validate({ body: loginSchema }), acl("login", "login"), async (req, res, next) => {

	const user = await db<UserRecord>("app.users")
		.select("id", "login", "password")
		.where({ login: req.body.login.toLowerCase() })
		.first();

	if (!user) return res.status(404).send("User not found");

	const same: boolean = await bcrypt.compare(req.body.password, user.password);

	if (same) {

		var tokenData = {
			id: user.id,
			login: user.login,
			managedProfiles: await db<UserProfileRecord>("app.user_profiles").where({ userId: user.id }).then(rows => rows.map(row => row.profileId)),
			roles: await db<UserRoleRecord>("app.user_roles").where({ userId: user.id }).then(rows => rows.map(row => row.role)),
		};

		const token = await createToken(tokenData, "1 day");

		res.send(token);
	}

	else {
		res.status(401).send("Wrong password for user \"" + user.id + "\".");
	}

});

router.get("/renew", acl("login", "renew"), async (req, res, next) => {

	const user = await db<UserRecord>("app.users")
		.select("id", "login", "password")
		.where({ id: req.body.login.toLowerCase() })
		.first();

	if (!user) return res.sendStatus(404);

	var tokenData = {
		_id: user.id,
		managedProfiles: await db<UserProfileRecord>("app.user_profiles").where({ userId: user.id }).then(rows => rows.map(row => row.profileId)),
		roles: await db<UserRoleRecord>("app.user_roles").where({ userId: user.id }).then(rows => rows.map(row => row.role)),
	};

	const token = await createToken(tokenData, "1 day");

	res.send(token);
});
