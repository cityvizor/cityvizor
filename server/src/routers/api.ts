import express from "express";

export const ApiRouter = express.Router();

// Handle and romalize standard query fields
ApiRouter.use((req, res, next) => {
  
	//normalize field list for mongoose from comma delimited to space delimited
	if(req.query.fields && typeof req.query.fields === "string") req.query.fields = req.query.fields.split(/[, ]/);
	
	// normalize page and limit to numbers
	if(req.query.page) req.query.page = Number(req.query.page);
	if(req.query.limit) req.query.limit = Number(req.query.limit);
	
	// continue
  next();
});

/* GENERAL API */
ApiRouter.use(require("../api").router);

/* OTHER REQUESTS TO /api AS 404 */

ApiRouter.use("**", (req,res) => res.sendStatus(404));