import express from 'express';
import acl from "express-dynacl";

import { db } from "../db";
import { AccountingRecord } from 'src/schema/accounting';

export const router = express.Router({ mergeParams: true });

router.get("/", acl("profile-accounting", "list"), async (req, res, next) => {

	const years = await db<AccountingRecord>("accounting")
		.select("year", "type").sum({ amount: "amount" })
		.where({ profile_id: req.params.id })
		.groupBy("year", "type");

	if (years.length) res.json(years);
	else res.sendStatus(404);
});

router.get("/:year", acl("profile-accounting", "read"), async (req, res, next) => {

	const accounting = await db<AccountingRecord>("accounting")		
		.where({ profileId: req.params.profile, year: req.params.year })

	res.json(accounting);

});