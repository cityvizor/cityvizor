var express = require('express');
var router = module.exports = express.Router();

router.use("/counterparties",require("../api/counterparties").router);

router.use("/profiles",require("../api/profiles").router);

router.use("/login",require("../api/login"));

router.use("/users",require("../api/users"));

router.use("/codelists",require("../api/codelists").router);


/* PROFILE DATA */
router.use("/profiles/:profile/accounting",require("../api/profile-accounting").router);

router.use("/profiles/:profile/contracts",require("../api/profile-contracts").router);

router.use("/profiles/:profile/dashboard",require("../api/profile-dashboard").router);

router.use("/profiles/:profile/years",require("../api/profile-years").router);

router.use("/profiles/:profile/events",require("../api/profile-events").router);

router.use("/profiles/:profile/import",require("../api/profile-import"));

router.use("/profiles/:profile/payments",require("../api/profile-payments").router);

router.use("/profiles/:profile/noticeboard",require("../api/profile-noticeboard"));