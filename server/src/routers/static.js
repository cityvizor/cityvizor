const express = require("express");
const router = module.exports = express.Router();

const config = require("../../config");

router.use(express.static(config.static.dir));

router.get("**",(req,res) => {
  res.sendFile(config.static.index);
});