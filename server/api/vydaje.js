var express = require('express');
var app = express();

var router = express.Router();

function sendExpenditureFile(ico,rok){
		
}

router.get("/:ico/:rok",(req,res) => {
	var path = "data/" + req.params.ico + "/expenditures_" + req.params.rok + ".csv";
	res.sendFile(path, { root: __dirname + "/../.." });
});

router.get("/:ico",(req,res) => {
	res.json([]);
});

router.get("/",(req,res) => {
	res.json([]);
});

module.exports = router;