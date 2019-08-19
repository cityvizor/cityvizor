import express from 'express';

import multer from 'multer';
import acl from "express-dynacl";
import schema from 'express-jsonschema';

import config from "../../config";

import { Importer } from "./import";
import { db } from '../db';
import { YearRecord } from '../schema';

export const router = express.Router({ mergeParams: true });

const importAccountingSchema = {
	body: {
		type: "object",
		properties: {
			"year": { type: "string" },
			"validity": { type: "string", format: "date" }
		},
		required: ["year"],
		additionalProperties: false
	}
};


const upload = multer({ dest: config.storage.tmp });

router.post("/accounting",
	upload.fields([{ name: "dataFile", maxCount: 1 }, { name: "zipFile", maxCount: 1 }, { name: "eventsFile", maxCount: 1 }, { name: "paymentsFile", maxCount: 1 }]),
	schema.validate(importAccountingSchema),
	acl("profile-import", "write"),
	async (req, res, next) => {

		// When file missing throw error immediately
		if (!req.files || (!req.files.dataFile && !req.files.zipFile)) return res.status(400).send("Missing data file or zip file");
		if (isNaN(req.body.year)) return res.status(400).send("Invalid year value");

		const validity = new Date(req.body.validity);
		if (!(validity instanceof Date) || isNaN(validity.getTime())) return res.status(400).send("Invalid validity date value");

		var year = await db<YearRecord>("data.years")
			.where({ profile: req.params.profile, year: req.body.year })
			.first();

		if (!year) year = await db<YearRecord>("data.years").insert({ profileId: req.params.profile, year: req.body.year, hidden: false }, ["id", "profile", "year"]);

		// here we deal with the import
		var importer = new Importer(year);

		var importData = {
			validity: validity,
			userId: req.user ? req.user._id : null,
			files: {
				zipFile: req.files.zipFile ? req.files.zipFile[0].path : null,
				dataFile: req.files.dataFile ? req.files.dataFile[0].path : null,
				eventsFile: req.files.eventsFile ? req.files.eventsFile[0].path : null,
				paymentsFile: req.files.paymentsFile ? req.files.paymentsFile[0].path : null
			}
		};

		// TODO: add to qqueue instead of direct execution
		await importer.import(year, importData);

		// response sent immediately, the import is in queue
		// TODO
		res.json({

		});

	}
);