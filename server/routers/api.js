var express = require('express');
var app = express();

var router = express.Router();

var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended: true}))

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/supervizor-plus');


router.use("/entities",require("../api/entities"));

router.use("/vydaje",require("../api/vydaje"));

router.use("/prezkum-hospodareni",require("../api/prezkum-hospodareni"));
					 
router.get("/",(req,res) => {
	res.sendFile("index.html", { root: __dirname + "/.." });	
});

module.exports = router;