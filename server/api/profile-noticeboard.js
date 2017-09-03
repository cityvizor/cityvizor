var express = require('express');	

var router = module.exports = express.Router({mergeParams: true});

var acl = require("express-dynacl");

var NoticeBoard = require("../models/noticeboard");

router.get("/", acl("profile-noticeboard", "read"), (req,res) => {
	
	NoticeBoard.findOne({profile:req.params.profile})
		.then(noticeBoard => res.json(noticeBoard))
		.catch(err => res.status(500).send(err));

});