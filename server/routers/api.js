var express = require('express');

var acl = require("express-dynacl");

var jwt = require('express-jwt');


// create router for api path
var router = module.exports = express.Router();


// Handle and romalize standard query fields
router.use((req, res, next) => {
  
	//normalize field list for mongoose from comma delimited to space delimited
	if(req.query.fields) req.query.fields = req.query.fields.split(",").join(" ");
	
	// normalize page and limit to numbers
	if(req.query.page) req.query.page = Number(req.query.page);
	if(req.query.page) req.query.page = Number(req.query.page);
	
	// continue
  next();
});


// configure DynACL
var aclOptions = {
	roles: {
		"guest": require("../acl/guest"),
		"profile-manager": require("../acl/profile-manager"),
		"profile-admin": require("../acl/profile-admin"),
		"admin": require("../acl/admin")
	},
	defaultRoles: ["guest"],
	logConsole: true
}
acl.config(aclOptions);


// configure express-jwt
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

router.use("/etl",require("../api/etl"));


/* DOWNLOAD DATASETS IN ZIP */
router.use("/exports",acl("exports","read"),express.static("exports"));

router.use("/exports", (req,res) => res.sendStatus(404));


/* PROFILE DATA */
router.use("/profiles/:profile/budgets",require("../api/profile-budgets"));

router.use("/profiles/:profile/contracts",require("../api/profile-contracts"));

router.use("/profiles/:profile/dashboard",require("../api/profile-dashboard"));

router.use("/profiles/:profile/events",require("../api/profile-events"));

router.use("/profiles/:profile/payments",require("../api/profile-payments"));

router.use("/profiles/:profile/managers",require("../api/profile-managers"));


/* IMPORT APIs */
router.use("/import",require("../api/import"));


/* ROOT */
router.get("/", (req,res) => res.sendFile("index.html", { root: __dirname + "/../api" }));

router.get("*", (req,res) => res.sendStatus(404));