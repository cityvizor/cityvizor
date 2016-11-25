var express = require('express');
var app = express();

var router = express.Router();

var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

var Expenditures = require("../models/expenditures");
var ExpenditureImport = require("../import/expenditures");

router.get("/:ico/:rok",(req,res) => {
	
	Expenditures.findOne({ico:req.params.ico,year:req.params.rok}, (err,item) => res.json(item));
	/*var path = "data/" + req.params.ico + "/expenditures_" + req.params.rok + ".csv";
	res.sendFile(path, { root: __dirname + "/../.." });*/
});

router.get("/:ico",(req,res) => {
	res.json([]);
});

router.get("/",(req,res) => {
	res.json([]);
});

router.post("/:ico/:rok", upload.single('file'), (req,res) => {
	if(req.file.path){
		ExpenditureImport(req.file.path,req.params.ico,req.params.rok);
		res.sendStatus(200);
	}
	else {
		res.sendStatus(500);
	}	
});

module.exports = router;