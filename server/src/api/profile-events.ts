import express from 'express';
import schema from 'express-jsonschema';
import acl from "express-dynacl";

import { db } from "../db";
import { EventRecord } from 'src/schema';

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

router.get("/", schema.validate({ body: eventSchema }), acl("profile-events", "list"), async (req, res) => {

	const events = await db("events AS e")
		.leftJoin("accounting AS a", { "a.profile_id": "e.profile_id", "a.year": "e.year" })
		.select("e.id", "e.name")
		.sum("a.budgetAmount AS budgetAmount")
		.sum("a.amount AS amount")
		.where({ "e.profile_id": req.params.profile })
		.modify(function () {
			if (req.query.year) this.where({ "e.year": req.query.year });
		})
		.groupBy("e.id","e.name");

	res.json(events);

});