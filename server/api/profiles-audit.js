var express = require('express');
var app = express();

var router = express.Router({mergeParams: true});

var acl = require("../acl/index");

module.exports = router;