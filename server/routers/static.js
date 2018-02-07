var express = require('express');
var app = express();

var path = require("path");

var router = express.Router();

router.use('/', express.static("dist", {fallthrough: true, maxage: 10 * 60 * 1000})); // cache 10 min

router.use('/assets', express.static("assets", {fallthrough: false, maxage: 60 * 60 * 1000})); // cache 1 hour

router.use('/data/uploads', express.static("data/uploads", {fallthrough: false, maxage: 0})); // cache 0

router.use('/data', express.static("data", {fallthrough: false, maxage: 10 * 60 * 1000})); // cache 10 min

let root = path.join(__dirname,"/../..");

router.get('/favicon.ico',(req,res) => {
	res.set('Cache-Control', 'public, max-age=3600'); // cache 1 hour
	res.sendFile("assets/img/favicon/favicon.ico", { root: root });	
});

router.get('*',(req,res) => {
	res.set('Cache-Control', 'public, max-age=600'); // cache 10 min
	res.sendFile("dist/app.index.html", { root: root });	
});

module.exports = router;