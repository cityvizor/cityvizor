var express = require('express');

var acl = require("../acl/index");

var jwt = require('express-jwt');

var router = module.exports = express.Router();

var jwtOptions = {
	secret: "kaj;aliuew ;932fjadkjfp9832jf;dlkj",
	credentialsRequired: false
};
router.use(jwt(jwtOptions));

router.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(err.status);
		res.send("Unauthorized" + (err.message ? ": " + err.message : ""));
  }
});


/* GENERAL API */
router.use("/entities",require("../api/entities"));

router.use("/profiles",require("../api/profiles"));

router.use("/events",require("../api/events"));

router.use("/login",require("../api/login"));

router.use("/users",require("../api/users"));

router.use("/profiles",require("../api/profiles"));

router.use("/notice-boards",require("../api/notice-boards"));

/* DOWNLOAD DATASETS IN ZIP */
router.use("/exports",acl("exports","read"),express.static("exports"));
router.use("/exports", (req,res) => res.sendStatus(404));

/* PROFILE DATA */
router.use("/profiles/:profile/dashboard",require("../api/profiles-dashboard"));

router.use("/profiles/:profile/budgets",require("../api/profiles-budgets"));

router.use("/profiles/:profile/events",require("../api/profiles-events"));

router.use("/profiles/:profile/invoices",require("../api/profiles-invoices"));

router.use("/profiles/:profile/audit",require("../api/profiles-audit"));


/* IMPORT APIs */
router.use("/import",require("../api/import"));


/* ROOT */
					 
router.get("/", (req,res) => res.sendFile("index.html", { root: __dirname + "/../api" }));

router.get("*", (req,res) => res.sendStatus(404));