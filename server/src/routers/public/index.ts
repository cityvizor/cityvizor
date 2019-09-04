import express from "express";
import { ProfilesRouter } from "./profiles";

const router = express.Router();

export const PublicRouter = router;

// Handle and romalize standard query fields
router.use((req, res, next) => {
  
	//normalize field list for mongoose from comma delimited to space delimited
	if(req.query.fields && typeof req.query.fields === "string") req.query.fields = req.query.fields.split(/[, ]/);
	
	// normalize page and limit to numbers
	if(req.query.page) req.query.page = Number(req.query.page);
	if(req.query.limit) req.query.limit = Number(req.query.limit);
	
	// continue
  next();
});

router.use("/counterparties", require("../api/counterparties").router);

router.use("/profiles", ProfilesRouter);

router.use("/users", require("../api/users").router);

router.use("/codelists", require("../api/codelists").router);


/* PROFILE DATA */
router.use("/profiles/:profile/accounting", require("../api/profile-accounting").router);

router.use("/profiles/:profile/contracts", require("../api/profile-contracts").router);

router.use("/profiles/:profile/dashboard", require("../api/profile-dashboard").router);

router.use("/profiles/:profile/years", require("../api/profile-years").router);

router.use("/profiles/:profile/events", require("../api/profile-events").router);

router.use("/profiles/:profile/payments", require("../api/profile-payments").router);

router.use("/profiles/:profile/noticeboard", require("../api/profile-noticeboard").router);

/* OTHER REQUESTS TO /api AS 404 */

router.use("**", (req,res) => res.sendStatus(404));