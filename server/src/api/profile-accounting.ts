import express from 'express';
import acl from "express-dynacl";

import { db } from "../db";
import { AccountingRecord } from 'src/schema/accounting';

export const router = express.Router({ mergeParams: true });

router.get("/", acl("profile-budgets", "list"), async (req, res, next) => {

	const years = await db<AccountingRecord>("accounting")
		.select("year", "type").sum({ amount: "amount" })
		.where({profile_id: req.params.id})
		.groupBy("year", "type");

	if (years.length) res.json(years);
	else res.sendStatus(404);
});

router.get("/:year", acl("profile-budgets", "read"), async (req, res, next) => {

	const query = `SELECT type, item, paragraph, unit, SUM(amount) AS amount
								 FROM accounting
								 WHERE profile_id = %L AND year = %L
								 GROUP BY type, item, paragraph, unit`;

	const accounting = await db<AccountingRecord>("accounting")
		.select("type","item","paragraph","unit").sum({amount:"amount"})
		.where({profile_id: req.params.id})
		.groupBy("type","item","paragraph","unit");

	res.json(accounting);

});