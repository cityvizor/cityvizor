const express = require('express');
const router = module.exports = express.Router({ mergeParams: true });

const multer = require('multer');
const acl = require("express-dynacl");
const schema = require('express-jsonschema');

// remove when import of ZIP sorted out
const unzip = require("unzip");
const fs = require("fs-extra");

const config = require("../../config");

const { Importer } = require("./import");

const ETL = require("../models/etl");

const importAccountingSchema = {
	body: {
		type: "object",
		properties: {
			"year": { type: "string", pattern: "^\d{4}$", required: true },
			"validity": { type: "string", format: "date" }
		},
		additionalProperties: false
	},
	files: {
		type: "object",
		properties: {
			"dataFile": { type: "object", required: false },
			"eventsFile": { type: "object", required: false },
			"paymentsFile": { type: "object", required: false }
		}
	}
};

const upload = multer({ dest: config.storage.tmp });

router.post("/accounting",
	upload.fields([{ name: "dataFile", maxCount: 1 }, { name: "eventsFile", maxCount: 1 }, { name: "paymentsFile", maxCount: 1 }]),
	schema.validate(importAccountingSchema),
	acl("profile-import", "write"),
	async (req, res, next) => {

		// When file missing throw error immediately
		if (!req.files || (!req.files.dataFile && !req.files.zipFile)) return res.status(400).send("Missing data file or zip file");

		var etl = await ETL.findOne({ profile: req.params.profile, year: req.body.year });

		if (!etl) etl = await ETL.create({ profile: req.params.profile, year: req.body.year })

		// here we deal with the import
		var importer = new Importer(etl);

		var importData = {
			validity: req.query.validity,
			userId: req.user ? req.user._id : null,
			files: {
				zipFile: req.files.zipFile ? req.files.zipFile[0].path : null,
				dataFile: req.files.dataFile ? req.files.dataFile[0].path : null,
				eventsFile: req.files.eventsFile ? req.files.eventsFile[0].path : null,
				paymentsFile: req.files.paymentsFile ? req.files.paymentsFile[0].path : null
			}
		};

		etl.status = "queued";
		await etl.save();

		importer.import(etl, importData);

		// response sent immediately, the import is in queue
		res.json(etl);

	}
);