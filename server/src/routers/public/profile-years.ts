import express from 'express';
import fs from "fs-extra";

import schema from 'express-jsonschema';
import acl from "express-dynacl";

import config from "../../config";

import { db } from "../../db";
import { YearRecord } from '../../schema/database';

export const router = express.Router({ mergeParams: true });

router.get("/", async (req, res, next) => {

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


router.get("/:year", async (req, res, next) => {

	const year = await db<YearRecord>("years")
		.where({ profile_id: req.params.profile, year: Number(req.params.year) });

	res.json(year);

});