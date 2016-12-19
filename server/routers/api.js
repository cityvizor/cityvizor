var express = require('express');

var jwt = require('express-jwt');

var router = module.exports = express.Router();

var jwtOptions = {
	secret: "kaj;aliuew ;932fjadkjfp9832jf;dlkj",
	credentialsRequired: false
};
router.use(jwt(jwtOptions));
	
router.use("/prehled",require("../api/prehled"));

router.use("/entities",require("../api/entities"));

router.use("/profiles",require("../api/profiles"));

router.use("/vydaje",require("../api/vydaje"));

router.use("/prezkum-hospodareni",require("../api/prezkum-hospodareni"));

router.use("/uredni-desky",require("../api/uredni-desky"));

router.use("/login",require("../api/login"));

router.use("/users",require("../api/users"));
					 
router.get("/", (req,res) => res.sendFile("index.html", { root: __dirname + "/../api" }));

router.get("*", (req,res) => res.sendStatus(404));