import express from 'express';
import acl from "express-dynacl";

import config from "../../config";

import { db } from "../../db";
import { AccountingRecord, PaymentRecord, EventRecord } from '../../schema';

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

router.get("/:year/groups/:field", acl("profile-accounting", "read"), async (req, res, next) => {

	const field = req.params.field;

	if (["paragraph", "item"].indexOf(field) === -1) return res.status(400).send("Parameter field can only have values paragraph or item.");

	const groups = await db<AccountingRecord>("accounting")
		.select(db.raw(`SUBSTRING(${field}::varchar, 1, 2) AS id`))
		.sum("incomeAmount as incomeAmount")
		.sum("budgetIncomeAmount as budgetIncomeAmount")
		.sum("expenditureAmount as expenditureAmount")
		.sum("budgetExpenditureAmount as budgetExpenditureAmount")
		.where({ profileId: req.params.profile, year: req.params.year })
		.groupBy("id");

	res.json(groups);

});

router.get("/:year/groups/:field/:group/events", acl("profile-accounting", "read"), async (req, res, next) => {

	const field = req.params.field;
	const group = req.params.group;

	if (["paragraph", "item"].indexOf(field) === -1) return res.status(400).send("Parameter field is mandatory and can only have values paragraph or item.");

	const events = await db("accounting AS a")
		.leftJoin("events AS e", { "e.profileId": "a.profileId", "e.year": "a.year", "e.id": "a.event" })
		.select("e.id AS id")
		.max("e.name AS name")
		.sum("a.incomeAmount as incomeAmount")
		.sum("a.budgetIncomeAmount as budgetIncomeAmount")
		.sum("a.expenditureAmount as expenditureAmount")
		.sum("a.budgetExpenditureAmount as budgetExpenditureAmount")
		.where({ "a.profileId": req.params.profile, "a.year": req.params.year })
		.andWhereRaw(`SUBSTRING(a.${field}::varchar, 1, 2) = ?`, [group])
		.groupBy("id");


	const eventIndex = {};
	events.forEach(event => {
		event.items = [];
		eventIndex[event.id] = {
			event,
			itemIndex: {}			
		}
	});

	const items = await db("accounting AS a")
		.leftJoin("events AS e", { "e.profileId": "a.profileId", "e.year": "a.year", "e.id": "a.event" })
		.select("e.id AS id", "item")
		.sum("a.incomeAmount as incomeAmount")
		.sum("a.budgetIncomeAmount as budgetIncomeAmount")
		.sum("a.expenditureAmount as expenditureAmount")
		.sum("a.budgetExpenditureAmount as budgetExpenditureAmount")
		.where({ "a.profileId": req.params.profile, "a.year": req.params.year })
		.andWhereRaw(`SUBSTRING(a.${field}::varchar, 1, 2) = ?`, [group])
		.groupBy("id", "item");

	// assign item amounts to each event
	for (let row of items) {

		if (!eventIndex[row.id]) continue;

		let item = eventIndex[row.id].itemIndex[row.item];
		if (!item) {
			item = { id: row.item };
			eventIndex[row.id].itemIndex[row.item] = item;
			eventIndex[row.id].event.items.push(item);
		}

		item.incomeAmount = row.incomeAmount;
		item.budgetIncomeAmount = row.budgetIncomeAmount;
		item.expenditureAmount = row.expenditureAmount;
		item.budgetExpenditureAmount = row.budgetExpenditureAmount;
	}

	res.json(events);

});