import express from 'express';

import schema from 'express-jsonschema';

import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const router = express.Router();

export const AccountLoginRouter = router;

import config from "../../config";
import { db } from '../../db';
import { UserRecord, UserProfileRecord } from '../../schema/database';
import { DateTime } from 'luxon';
import { UserToken } from '../../schema/user';

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

router.post("/", schema.validate({ body: loginSchema }), async (req, res, next) => {

	const user = await db<UserRecord>("app.users")
		.select("id", "login", "password", "role")
		.where({ login: req.body.login.toLowerCase() })
		.first();

	if (!user) return res.status(404).send("User not found");

	const same: boolean = await bcrypt.compare(req.body.password, user.password);

	if (same) {

		var tokenData: UserToken = {
			id: user.id,
			login: user.login,
			roles: [user.role],
			managedProfiles: await db<UserProfileRecord>("app.user_profiles").where({ userId: user.id }).then(rows => rows.map(row => row.profileId)),
		};

		const token = await createToken(tokenData, "1 day");

		res.send(token);

		await db<UserRecord>("app.users").where({ id: user.id }).update({ "lastLogin": DateTime.local().toISO() });
	}

	else {
		res.status(401).send("Wrong password for user \"" + user.id + "\".");
	}

});

router.get("/renew", async (req, res, next) => {

	const userId = req.user.id;

	const user = await db<UserRecord>("app.users")
		.select("id", "login", "password", "role")
		.where({ id: userId })
		.first();

	if (!user) return res.sendStatus(404);

	var tokenData = {
		id: user.id,
		login: user.login,
		roles: [user.role],
		managedProfiles: await db<UserProfileRecord>("app.user_profiles").where({ userId: user.id }).then(rows => rows.map(row => row.profileId)),
	};

	const token = await createToken(tokenData, "1 day");

	res.send(token);
});
