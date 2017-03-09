var express = require('express');
var app = express();

var path = require("path");

var router = express.Router();

router.use('/src', express.static("src"));
router.get("/src", (req,res) => res.sendStatus(404));

router.use('/build', express.static("build"));
router.get("/build", (req,res) => res.sendStatus(404));

router.use('/assets', express.static("assets"));
router.get("/assets", (req,res) => res.sendStatus(404));

router.use('/exports', express.static("exports"));
router.get("/exports", (req,res) => res.sendStatus(404));

router.use('/node_modules', express.static("node_modules"));
router.get("/node_modules", (req,res) => res.sendStatus(404));

router.use('/doc', express.static("doc"));
router.get("/doc", (req,res) => res.sendStatus(404));

router.get("/favicon.ico", (req,res) => res.sendStatus(404));

module.exports = router;