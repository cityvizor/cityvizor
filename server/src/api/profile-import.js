const express = require('express');
const router = module.exports = express.Router({ mergeParams: true });

const multer = require('multer');
const acl = require("express-dynacl");
const schema = require('express-jsonschema');

const config = require("../../config");

const { Importer } = require("./import");

const ETL = require("../models/etl");

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
		if(isNaN(req.body.year)) return res.status(400).send("Invalid year value");
		
		const validity = new Date(req.body.validity);
		if(!validity instanceof Date || isNaN(validity.getTime())) return res.status(400).send("Invalid validity date value");

		var etl = await ETL.findOne({ profile: req.params.profile, year: req.body.year });

		if (!etl) etl = await ETL.create({ profile: req.params.profile, year: req.body.year })

		// here we deal with the import
		var importer = new Importer(etl);

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

		etl.status = "queued";
		await etl.save();

		// TODO: add to qqueue instead of direct execution
		await importer.import(etl, importData);

		// response sent immediately, the import is in queue
		res.json(etl);

	}
);