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

ApiRouter.use("/counterparties", require("../api/counterparties").router);

ApiRouter.use("/profiles", require("../api/profiles").router);

ApiRouter.use("/login", require("../api/login").router);

ApiRouter.use("/users", require("../api/users").router);

ApiRouter.use("/codelists", require("../api/codelists").router);


/* PROFILE DATA */
ApiRouter.use("/profiles/:profile/accounting", require("../api/profile-accounting").router);

ApiRouter.use("/profiles/:profile/contracts", require("../api/profile-contracts").router);

ApiRouter.use("/profiles/:profile/dashboard", require("../api/profile-dashboard").router);

ApiRouter.use("/profiles/:profile/years", require("../api/profile-years").router);

ApiRouter.use("/profiles/:profile/events", require("../api/profile-events").router);

ApiRouter.use("/profiles/:profile/import", require("../api/profile-import").router);

ApiRouter.use("/profiles/:profile/payments", require("../api/profile-payments").router);

ApiRouter.use("/profiles/:profile/noticeboard", require("../api/profile-noticeboard").router);

/* OTHER REQUESTS TO /api AS 404 */

ApiRouter.use("**", (req,res) => res.sendStatus(404));