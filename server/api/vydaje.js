var express = require('express');
var app = express();

var router = express.Router();

router.get("/:ico/:rok",(req,res) => {
	res.json([]);
});

router.get("/:ico",(req,res) => {
	res.json([]);
});

router.get("/",(req,res) => {
	res.json([]);
});

module.exports = router;