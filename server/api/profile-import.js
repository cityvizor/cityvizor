var express = require('express');	
var router = module.exports = express.Router({mergeParams: true});

var multer = require('multer');
var acl = require("express-dynacl");
var schema = require('express-jsonschema');
var fs = require("fs");
var async = require("async");

var config = require("../config/config");

var Importer = require("../import/importer");

var ETL = require("../models/etl");

var importUploadSchema = {
	type: "object",
	properties: {
		"validity": {type: "string"}
	}
};

var upload = multer({ dest: config.storage.tmpDir });

router.put("/:etl/upload", schema.validate({body: importUploadSchema}), upload.single("file"), acl("profile-import","write"), (req,res,next) => {
	
	// When file missing throw error immediately
	if(!req.file) return next(new Error("Missing file"));

	ETL.findOne({_id: req.params.etl})
		.then(etl => {
		
			// in case of wrong/old etl we return 404 and stop processing the import
			if(!etl) return res.sendStatus(404);

			// here we deal with the import
			var importer = new Importer(etl);
			importer.validity = req.body.validity;
			importer.userId = req.user ? req.user._id : null;
		
			var tasks = [

				cb => importer.importFile(req.file.path,cb),

				(result,cb) => fs.unlink(req.file.path,err => (!err || err.code == 'ENOENT' ? cb() : cb(err))),

			];

			async.waterfall(tasks, err => {
				if(err) console.error(err);
			});
		
				
			// we send response immediately, while the import may take longer
			res.sendStatus(200);

		})
		.catch(err => next(err));
});

var importStartSchema = {
	type: "object",
	properties: {
	}
};

router.get("/:etl/start", schema.validate({body: importStartSchema}), acl("profile-import","write"), (req,res,next) => {

	ETL.findOne({_id: req.params.etl})
		.then(etl => {
		
			// in case of wrong/old etl we return 404 and stop processing the import
			if(!etl) return res.sendStatus(404);

			// here we deal with the import
			var importer = new Importer(etl);
			importer.userId = req.user ? req.user._id : null;

			importer.importUrl(etl.url,err => {
				if(err) console.error(err.message);
			});
		
			// we send response immediately, while the import may take longer
			res.sendStatus(200);

		})
		.catch(err => next(err));
});