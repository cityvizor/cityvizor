import express from 'express';

import {db} from "../../db";
import config from '../../config';

import {ProfileRecord, AccountingRecord, PaymentRecord, EventRecord} from '../../schema';

import {exportQuery} from './tools/export';

const router = express.Router();

export const ExportProfilesRouter = router;

router.get("/", async (req, res, _) => {

    const profiles = db<ProfileRecord>("profiles")
        .select("id", "name", "email", "ico", "databox", "edesky", "mapasamospravy", "gps_x", "gps_y")
        .select(db.raw(`CONCAT('${config.url}','/profiles/',url) AS url`))
        .where({status: "visible"})

    exportQuery(req, res, profiles, "profiles");

});

router.get("/:profile/years", async (req, res, _) => {

    const years = db("years as y")
        .select("y.year", "y.validity")
        .sum("a.expenditureAmount as expenditureAmount")
        .sum("a.budgetExpenditureAmount as budgetExpenditureAmount")
        .sum("a.incomeAmount as incomeAmount")
        .sum("a.budgetIncomeAmount as budgetIncomeAmount")
        .leftJoin("accounting as a", {"a.profileId": "y.profileId", "a.year": "y.year"})
        .where({"y.profile_id": req.params.profile})
        .groupBy("y.profileId", "y.year", "y.validity");

    exportQuery(req, res, years, `profile-${req.params.profile}-years`);
});

router.get("/:profile/accounting/:year", async (req, res, _) => {

    const accounting = db<AccountingRecord>("accounting")
        .where('profileId', req.params.profile)
        .andWhere('year', req.params.year);

    exportQuery(req, res, accounting, `profile-${req.params.profile}-accounting`);

});

router.get("/:profile/events/:year", async (req, res, _) => {

    const amounts = db("accounting")
        .select("profileId", "year", "event")
        .sum("incomeAmount as incomeAmount")
        .sum("budgetIncomeAmount as budgetIncomeAmount")
        .sum("expenditureAmount as expenditureAmount")
        .sum("budgetExpenditureAmount as budgetExpenditureAmount")
        .whereRaw("event IS NOT NULL")
        .groupBy("profileId", "year", "event");

    const events = db<EventRecord>("events as e")
        .leftJoin(amounts.as("a"), {"a.profileId": "e.profileId", "a.year": "e.year", "a.event": "e.id"})
        .select("e.year", "e.id", "e.name", "a.incomeAmount", "a.budgetIncomeAmount", "a.expenditureAmount", "a.budgetExpenditureAmount")
        .where({"e.profileId": req.params.profile, "e.year": req.params.year})

    exportQuery(req, res, events, `profile-${req.params.profile}-events`);

});

router.get("/:profile/payments/:year", async (req, res, _) => {

    const payments = db<PaymentRecord>("payments")
        .where('profile_id', req.params.profile)
        .andWhere('year', req.params.year);

    exportQuery(req, res, payments, `profile-${req.params.profile}-payments`);

});
