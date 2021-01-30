import express from 'express';
import acl from "express-dynacl";

import { db } from "../../db";
import { CodelistRecord } from '../../schema/database';

const router = express.Router();

export const CodelistsRouter = router;

router.get("/", async (req, res, next) => {
	const codelists = await db<CodelistRecord>("codelists").distinct("codelist").then(rows => rows.map(row => row.codelist));
	res.json(codelists);
});

router.get("/:name", async (req, res, next) => {

	const codelist = await db<CodelistRecord>("codelists")
		.select("id", "name", "description", "validFrom", "validTill")
		.where({ codelist: req.params.name });

	if (codelist.length) res.json(codelist);
	else res.sendStatus(404);

});