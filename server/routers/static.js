var express = require('express');
var app = express();

var path = require("path");

var router = express.Router();

router.use('/dist', express.static("dist"));
router.get("/dist", (req,res) => res.sendStatus(404));

router.use('/assets', express.static("assets"));
router.get("/assets", (req,res) => res.sendStatus(404));

router.use('/exports', express.static("exports"));
router.get("/exports", (req,res) => res.sendStatus(404));

let root = path.join(__dirname,"/../..");

router.get('/favicon.ico',(req,res) => {
	res.sendFile("assets/img/favicon/favicon.ico", { root: root });	
});

router.get('/embed/*',(req,res) => {
	res.sendFile("dist/embed/embed.index.html", { root: root });	
});

router.get('*',(req,res) => {
	res.sendFile("dist/app/app.index.html", { root: root });	
});

module.exports = router;