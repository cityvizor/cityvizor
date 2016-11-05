var express = require('express');
var app = express();

var router = express.Router();

router.use("/entities",require("../api/entities.js"));

router.use("/vydaje",require("../api/vydaje"));

router.use("/prezkum-hospodareni",require("../api/prezkum-hospodareni"));
					 
router.get("/",(req,res) => {
	res.sendFile("index.html", { root: __dirname + "/.." });	
});

module.exports = router;