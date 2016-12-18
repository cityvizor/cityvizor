var express = require('express');

var router = module.exports = express.Router();

router.use("/prehled",require("../api/prehled"));

router.use("/entities",require("../api/entities"));

router.use("/profiles",require("../api/profiles"));

router.use("/vydaje",require("../api/vydaje"));

router.use("/prezkum-hospodareni",require("../api/prezkum-hospodareni"));

router.use("/uredni-desky",require("../api/uredni-desky"));

router.use("/login",require("../api/login"));
					 
router.get("/",(req,res) => {
	res.sendFile("index.html", { root: __dirname + "/.." });	
});