var express = require('express');	
var async = require("async");
var fs = require("fs");

var router = module.exports = express.Router({mergeParams: true});

var schema = require('express-jsonschema');
var acl = require("express-dynacl");

var config = require("../config/config");

var Budget = require("../models/budget");
var Event = require("../models/payment");
var Payment = require("../models/event");
var ETL = require("../models/etl");
var ETLLog = require("../models/etl-log");

var etlsSchema = {
	type: "object",
	properties: {
		"sort": {type: "string", required: false}
	}	
};

router.get("/", schema.validate({query: etlsSchema}), acl("profile-etls","list"), (req,res,next) => {
	
	var query = ETL.find({profile:req.params.profile});
	if(req.query.sort) query.sort(req.query.sort);
	query	
		.then(etls => res.json(etls))
		.catch(err => next(err));

});

var etlCreateSchema = {
	type: "object",
	properties: {
		"year": {type: "number", required: true}
	}	
};

router.post("/", schema.validate({body: etlCreateSchema}), acl("profile-etls","write"), (req,res,next) => {
	var data = {profile: req.params.profile,year: req.body.year};
	
	ETL.create(data)
		.then(etl => res.json(etl))
		.catch(err => next(err));

});

router.get("/:etl", acl("profile-etls","read"), (req,res,next) => {
	
	ETL.findOne({_id:req.params.etl, profile:req.params.profile})
		.then(etl => res.json(etl))
		.catch(err => next(err));

});

router.put("/:etl", acl("profile-etls","write"), (req,res,next) => {
	
	ETL.findOneAndUpdate({_id:req.params.etl, profile:req.params.profile}, req.body, {new: true})
		.then(etl => res.json(etl))
		.catch(err => next(err));

});

router.delete("/:etl", acl("profile-etls", "write"), (req,res,next) => {
	
	ETL.findOne({profile:req.params.profile,_id:req.params.etl})
		.then(etl => {
		
			if(!etl) return res.sendStatus(404);

			var queries = [];
			queries.push(Budget.remove({etl:etl._id}));
			queries.push(Event.remove({etl:etl._id}));
			queries.push(Payment.remove({etl:etl._id}));
		
			queries.push(new Promise((resolve,reject) => {
				var tasks = [
					cb => fs.unlink(config.storage.importsDir + "/" + req.params.profile + "-" + etl.year + ".events.csv",cb),
					cb => fs.unlink(config.storage.importsDir + "/" + req.params.profile + "-" + etl.year + ".data.csv",cb)
				];
				async.parallel(tasks,err => {
					if(!err || err.code == 'ENOENT') resolve();
					else reject()
				});
			}));

		Promise.all(queries)
			.then(() => {

				if(req.query.type === "truncate"){
					etl.validity = null;
					etl.save()
						.then(() => res.sendStatus(200))
						.catch(err => next(err));
				}
				else{
					ETL.remove({_id:etl._id})
						.then(() => res.sendStatus(200))
						.catch(err => next(err));
				}
			
			})
			.catch(err => next(err));


		})
		.catch(err => next(err));
	
});

var etllogsSchema = {
	type: "object",
	properties: {
		"sort": {type: "string", required: false},
		"limit": {type: "number", required: false},
		"page": {type: "number", required: false}
	}	
};

router.get("/:etl/logs", schema.validate({query: etllogsSchema}), acl("profile-etllogs","list"), (req,res,next) => {
	
	var query = {etl:req.params.etl, profile:req.params.profile};

	var options = {};
	options.page = req.query.page || 1;
	if(req.query.sort) options.sort = req.query.sort;
	options.limit = req.query.limit ? Math.min(100,Number(req.query.limit)) : 20;

	ETLLog.paginate(query, options)
		.then(etls => res.json(etls))
		.catch(err => next(err));

});