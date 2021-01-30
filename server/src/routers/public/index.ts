import express from "express";

import {ProfilesRouter} from "./profiles";
import {CounterpartiesRouter} from "./counterparties";
import {CodelistsRouter} from "./codelists";
import {ProfileAccountingRouter} from "./profile-accounting";
import {ProfileContractsRouter} from "./profile-contracts";
import {ProfileYearsRouter} from "./profile-years";
import {ProfileDashboardRouter} from "./profile-dashboard";
import {ProfileEventsRouter} from "./profile-events";
import {ProfileNoticeboardRouter} from "./profile-noticeboard";
import {ProfilePaymentsRouter} from "./profile-payments";

const router = express.Router();

export const PublicRouter = router;

// Handle and romalize standard query fields
router.use((req, res, next) => {

    //normalize field list for mongoose from comma delimited to space delimited
    if (req.query.fields && typeof req.query.fields === "string") req.query.fields = req.query.fields.split(/[, ]/);

    // normalize page and limit to numbers
    if (req.query.page) req.query.page = Number(req.query.page).toString(10);
    if (req.query.limit) req.query.limit = Number(req.query.limit).toString(10);

    // continue
    next();
});

router.use("/counterparties", CounterpartiesRouter);

router.use("/profiles", ProfilesRouter);

router.use("/codelists", CodelistsRouter);

router.use("/feedback", FeedbackRouter)

/* PROFILE DATA */
router.use("/profiles/:profile/accounting", ProfileAccountingRouter);

router.use("/profiles/:profile/contracts", ProfileContractsRouter);

router.use("/profiles/:profile/dashboard", ProfileDashboardRouter);

router.use("/profiles/:profile/years", ProfileYearsRouter);

router.use("/profiles/:profile/events", ProfileEventsRouter);

router.use("/profiles/:profile/payments", ProfilePaymentsRouter);

router.use("/profiles/:profile/noticeboard", ProfileNoticeboardRouter);

/* OTHER REQUESTS TO /api AS 404 */

router.use("**", (req,res) => res.sendStatus(404));
