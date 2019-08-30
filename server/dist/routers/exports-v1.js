var express = require('express');
var router = module.exports = express.Router({ mergeParams: true });
var schema = require('express-jsonschema');
var acl = require("express-dynacl");
var etlFilter = require("../middleware/etl-filter");
var Profile = require("../models/profile");
var ETL = require("../models/etl");
var Budget = require("../models/budget");
var Event = require("../models/event");
var Payment = require("../models/payment");
var Codelist = require("../models/codelist");
function serveExport(req, res, filename, json) {
    res.setHeader("Cache-Control", "public, max-age=600");
    if (req.query.download)
        res.attachment(filename);
    res.json(json);
}
router.get("/profiles", acl("profiles", "list"), function (req, res, next) {
    Profile.find({ status: { $in: ["active", "pending"] } })
        .then(function (profiles) { return serveExport(req, res, "profiles.json", profiles); })
        .catch(function (err) { return next(err); });
});
router.get("/profiles/:profile", acl("profiles", "read"), function (req, res, next) {
    Profile.findOne({ _id: req.params.profile })
        .then(function (profile) { return serveExport(req, res, "profile-" + req.params.profile + ".json", profile); })
        .catch(function (err) { return next(err); });
});
router.get("/codelists/:codelist", etlFilter({ visible: true }), acl("budgets", "read"), function (req, res, next) {
    Codelist.findOne({ _id: req.params.codelist })
        .then(function (codelists) { return serveExport(req, res, "codelist-" + req.params.codelist + ".json", codelists); })
        .catch(function (err) { return next(err); });
});
router.get("/profiles/:profile/etls", etlFilter({ visible: true }), acl("etls", "list"), function (req, res, next) {
    ETL.find({ profile: req.params.profile, _id: { $in: req.etls } }).select("_id year lastModified")
        .then(function (etls) { return serveExport(req, res, "etls-" + req.params.profile + ".json", etls); })
        .catch(function (err) { return next(err); });
});
router.get("/profiles/:profile/budgets", etlFilter({ visible: true }), acl("budgets", "list"), function (req, res, next) {
    Budget.find({ profile: req.params.profile, etl: { $in: req.etls } }).select("year etl budgetExpenditureAmount budgetIncomeAmount expenditureAmount incomeAmount")
        .then(function (budgets) { return serveExport(req, res, "budgets-" + req.params.profile + ".json", budgets); })
        .catch(function (err) { return next(err); });
});
router.get("/profiles/:profile/events/:year", etlFilter({ visible: true }), acl("budgets", "read"), function (req, res, next) {
    Event.find({ profile: req.params.profile, etl: { $in: req.etls }, year: req.params.year })
        .then(function (events) { return serveExport(req, res, "events-" + req.params.profile + "-" + req.params.year + ".json", events); })
        .catch(function (err) { return next(err); });
});
router.get("/profiles/:profile/budgets/:year", etlFilter({ visible: true }), acl("budgets", "read"), function (req, res, next) {
    Budget.findOne({ profile: req.params.profile, year: req.params.year, etl: { $in: req.etls } })
        .then(function (budget) { return serveExport(req, res, "budget-" + req.params.profile + "-" + req.params.year + ".json", budget); })
        .catch(function (err) { return next(err); });
});
router.get("/profiles/:profile/payments/:year", etlFilter({ visible: true }), acl("payments", "read"), function (req, res, next) {
    Payment.find({ profile: req.params.profile, year: req.params.year, etl: { $in: req.etls } })
        .then(function (payments) { return serveExport(req, res, "payments-" + req.params.profile + "-" + req.params.year + ".json", payments); })
        .catch(function (err) { return next(err); });
});
