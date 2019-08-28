import express from 'express';
import schema from 'express-jsonschema';
import acl from "express-dynacl";

import { db } from "../db";
import { EventRecord, AccountingRecord, PaymentRecord } from 'src/schema/database';

export const router = express.Router({ mergeParams: true });

var eventSchema = {
	type: "object",
	properties: {
		"srcId": { type: "string" },
		"sort": { type: "string" },
		"year": { type: "number" },
		"fields": { type: "string" }
	}
};

router.get("/history/:event", acl("profile-events", "read"), async (req, res) => {

	const amounts = db("accounting")
		.select("profileId", "year", "event")
		.sum("incomeAmount as incomeAmount")
		.sum("budgetIncomeAmount as budgetIncomeAmount")
		.sum("expenditureAmount as expenditureAmount")
		.sum("budgetExpenditureAmount as budgetExpenditureAmount")
		.whereRaw("event IS NOT NULL")
		.groupBy("profileId", "year", "event");

	const events = await db<EventRecord>("events as e")
		.leftJoin(amounts.as("a"), { "a.profileId": "e.profileId", "a.year": "e.year", "a.event": "e.id" })
		.select("e.year", "e.id", "e.name", "a.incomeAmount", "a.budgetIncomeAmount", "a.expenditureAmount", "a.budgetExpenditureAmount")
		.where({ "e.profileId": req.params.profile, "e.id": req.params.event })

	res.json(events);

});

router.get("/:year/:event", acl("profile-events", "read"), async (req, res) => {

	const q_info = db<EventRecord>("events")
		.select("id", "name")
		.where({ profileId: req.params.profile, year: req.params.year, id: req.params.event })
		.first();

	const q_totals: any = db<AccountingRecord>("accounting")
		.sum("incomeAmount as incomeAmount")
		.sum("budgetIncomeAmount as budgetIncomeAmount")
		.sum("expenditureAmount as expenditureAmount")
		.sum("budgetExpenditureAmount as budgetExpenditureAmount")
		.where({ profileId: req.params.profile, year: req.params.year, event: req.params.event })
		.first();

	const q_items = db<AccountingRecord>("accounting")
		.select("item AS id")
		.sum("incomeAmount as incomeAmount")
		.sum("budgetIncomeAmount as budgetIncomeAmount")
		.sum("expenditureAmount as expenditureAmount")
		.sum("budgetExpenditureAmount as budgetExpenditureAmount")
		.where({ profileId: req.params.profile, year: req.params.year, event: req.params.event })
		.groupBy("item")

	const q_paragraphs = db<AccountingRecord>("accounting")
		.select("paragraph AS id")
		.sum("incomeAmount as incomeAmount")
		.sum("budgetIncomeAmount as budgetIncomeAmount")
		.sum("expenditureAmount as expenditureAmount")
		.sum("budgetExpenditureAmount as budgetExpenditureAmount")
		.where({ profileId: req.params.profile, year: req.params.year, event: req.params.event })
		.groupBy("paragraph")

	const q_payments = db<PaymentRecord>("payments")
		.where({ profileId: req.params.profile, year: req.params.year, event: req.params.event });

	const [info, totals, items, paragraphs, payments] = await Promise.all([q_info, q_totals, q_items, q_paragraphs, q_payments])

	const event = {
		...info,
		...totals,
		items,
		paragraphs,
		payments
	};

	res.json(event);

});

