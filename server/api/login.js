var express = require('express');
var router = express.Router();

var User = require("../models/user");

router.get("/",(req,res) => {
	console.log(req.body);
	res.json(req.body);
});

module.exports = router;