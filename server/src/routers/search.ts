import express from "express";
export const SearchRouter = express.Router({mergeParams: true});

var schema = require('express-jsonschema');
var acl = require("express-dynacl");


SearchRouter.post("/counterparties", acl("payments", "list"), (req,res,next) => {
	
});

SearchRouter.post("/payments", acl("payments", "list"), (req,res,next) => {
	
});