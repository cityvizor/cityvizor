var express = require('express');	
var app = express();

var router = express.Router();

var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

var acl = require("../acl/index");

var ExpenditureImport = require("../import/expenditures");

router.post("/expenditures/:profile/:rok", acl("events", "write"), acl("budget", "write"), upload.single('file'), (req,res) => {
	
	console.log(req.file);
	
	if(req.file.path){
		ExpenditureImport(req.file.path,req.params.profile,req.params.rok);
		res.sendStatus(200);
	}
	else {
		res.sendStatus(500);
	}	
});

module.exports = router;