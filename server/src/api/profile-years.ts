import express from 'express';
import fs from "fs-extra";

import schema from 'express-jsonschema';
import acl from "express-dynacl";

import config from "../../config";

import { db } from "../db";
import { YearRecord } from 'src/schema';

export const router = express.Router({ mergeParams: true });

router.get("/", acl("profile-years", "list"), async (req, res, next) => {

	const years = await db("years as y")
		.select("y.profileId", "y.year", "y.validity")
		.sum("a.expenditureAmount as expenditureAmount")
		.sum("a.budgetExpenditureAmount as budgetExpenditureAmount")
		.sum("a.incomeAmount as incomeAmount")
		.sum("a.budgetIncomeAmount as budgetIncomeAmount")
		.leftJoin("accounting as a", { "a.profileId": "y.profileId", "a.year": "y.year" })
		.where({ "y.profile_id": req.params.profile })
		.groupBy("y.profileId","y.year","y.validity");

	res.json(years);
});

router.post("/", acl("profile-etls", "write"), async (req, res, next) => {
	var data = { profile_id: req.params.profile, year: req.body.year };

	await db("data.years").insert(data);

	res.sendStatus(201);
});

router.get("/:year", acl("profile-etls", "read"), async (req, res, next) => {

	const year = await db<YearRecord>("years")
		.where({ profile_id: req.params.profile, year: Number(req.params.year) });

	res.json(year);

});

router.patch("/:year", acl("profile-etls", "write"), async (req, res, next) => {

	await db<YearRecord>("years")
		.where({ profile_id: req.params.profile, year: Number(req.params.year) })
		.update(req.body);

	res.sendStatus(204);

});

router.delete("/:etl", acl("profile-etls", "write"), async (req, res, next) => {

	const yearId = { profile_id: req.params.profile, year: Number(req.params.year) };


	// remove the data
	await db("accounting").where(yearId).delete();
	await db("payments").where(yearId).delete();
	await db("events").where(yearId).delete();

	// only remove data
	if (req.query.type === "truncate") {
		await db("years").where(yearId).update({ validity: null })
	}
	// remove year record too
	else {
		await db("years").where(yearId).delete();
	}

	// success status
	res.sendStatus(204);

});