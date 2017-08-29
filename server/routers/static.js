var express = require('express');
var app = express();

var path = require("path");

var router = express.Router();

router.use('/dist', express.static("dist", {fallthrough: false}));

router.use('/assets', express.static("assets", {maxage: 60 * 60 * 1000, fallthrough: false})); // cache for one hour

router.use('/data', express.static("data", {fallthrough: false}));

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