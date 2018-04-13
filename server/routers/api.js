var express = require('express');
var router = module.exports = express.Router();

var acl = require("express-dynacl");

// Handle and romalize standard query fields
router.use((req, res, next) => {
  
	//normalize field list for mongoose from comma delimited to space delimited
	if(req.query.fields && typeof req.query.fields === "string") req.query.fields = req.query.fields.split(/[, ]/);
	
	// normalize page and limit to numbers
	if(req.query.page) req.query.page = Number(req.query.page);
	if(req.query.limit) req.query.limit = Number(req.query.limit);
	
	// continue
  next();
});


/* GENERAL API */

router.use("/counterparties",require("../api/counterparties"));

router.use("/etls",require("../api/etls"));

router.use("/events",require("../api/events"));

router.use("/profiles",require("../api/profiles"));

router.use("/login",require("../api/login"));

router.use("/users",require("../api/users"));

router.use("/codelists",require("../api/codelists"));


/* PROFILE DATA */
router.use("/profiles/:profile/budgets",require("../api/profile-budgets"));

router.use("/profiles/:profile/contracts",require("../api/profile-contracts"));

router.use("/profiles/:profile/dashboard",require("../api/profile-dashboard"));

router.use("/profiles/:profile/etls",require("../api/profile-etls"));

router.use("/profiles/:profile/events",require("../api/profile-events"));

router.use("/profiles/:profile/import",require("../api/profile-import"));

router.use("/profiles/:profile/payments",require("../api/profile-payments"));

router.use("/profiles/:profile/managers",require("../api/profile-managers"));

router.use("/profiles/:profile/noticeboard",require("../api/profile-noticeboard"));

router.get('/favicon.ico',(req,res) => {
	res.set('Cache-Control', 'public, max-age=3600'); // cache 1 hour
	res.sendFile("assets/img/favicon/favicon.ico", { root: root });	
});