var express = require('express');
var app = express();

module.exports = require("./config." + app.get('env'));