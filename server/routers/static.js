var express = require('express');
var app = express();

var path = require("path");

var router = express.Router();

router.use('/dist', express.static("dist"));
router.use('/dist-embed', express.static("dist-embed"));

router.use('/dist/assets', express.static("assets"));
router.use('/dist-embed/assets', express.static("assets"));

router.use('/dist/exports', express.static("exports"));
router.use('/dist/uploads', express.static("uploads"));

// if not found, then return not found and not the main page
router.use("/dist", (req,res) => res.sendStatus(404));

let root = path.join(__dirname,"/../..");

router.get('/favicon.ico',(req,res) => {
	res.sendFile("assets/img/favicon/favicon.ico", { root: root });	
});

router.get('/embed/*',(req,res) => {
	res.sendFile("dist-embed/embed.index.html", { root: root });	
});

router.get('*',(req,res) => {
	res.sendFile("dist/app.index.html", { root: root });	
});

module.exports = router;