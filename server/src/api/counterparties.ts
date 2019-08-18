// load express app and export router
import express from 'express';
import acl from "express-dynacl";

import { db } from "../db";
import { PaymentRecord } from 'src/schema/payment';
import { AccountingRecord } from 'src/schema/accounting';

export const router = express.Router();


// REQUEST: get event

router.get("/search", acl("counterparty", "list"), async (req, res, next) => {

  if (!req.query.query) return res.status(400).send("Missing parameter query");

  const counterparties = await db<PaymentRecord>("payments")
    .select("counterpartyId", "counterpartyName")
    .where("counterpartyName", "like", "%" + req.query.query + "%")
    .orWhere("counterpartyId", req.query.query);

  res.json(counterparties);

});

router.get("/top", acl("counterparty", "list"), async (req, res, next) => {

  const counterparties = await db<PaymentRecord>("payments")
    .select("counterpartyId")
    .max("counterpartyName as counterpartyName")
    .sum("amount as amount")
    .groupBy("counterpartyId")
    .limit(req.query.limit ? Math.min(Number(req.query.limit), 100) : 100);

  res.json(counterparties);
});

router.get("/:id", acl("counterparty", "read"), async (req, res, next) => {

  const counterpartyNames = await db<PaymentRecord>("payments")
    .select("counterpartyName")
    .where("counterpartyId", req.params.id)
    .then(rows => rows.map(row => row.counterpartyName));


  if (!counterpartyNames.length) return res.sendStatus(404);

  const counterparty = {
    id: req.params.id,
    name: counterpartyNames[0],
    names: counterpartyNames
  }

  res.json(counterparty);
});

router.get("/:id/accounting", acl("counterparty", "read"), async (req, res, next) => {

  const years = await db<PaymentRecord>("payments")
    .select("year", "type")
    .sum({ amount: "amount" })
    .where("counterpartyId", req.params.id)
    .groupBy("year", "type");

  if (years.length) res.json(years);
  else res.sendStatus(404);
});

router.get("/:id/accounting/:year", acl("counterparty", "read"), async (req, res, next) => {

  const accounting = await db<PaymentRecord>("payments")
    .select("type", "item", "paragraph", "unit")
    .sum({ amount: "amount" })
    .where({ "counterpartyId": req.params.id, "year": req.params.year })
    .groupBy("type", "item", "paragraph", "unit");

  if (accounting.length) res.json(accounting);
  else res.sendStatus(404);

});

router.get("/:id/payments", acl("counterparty", "read"), async (req, res, next) => {

  const payments = await db<PaymentRecord>("payments").where({ counterpartyId: req.params.id, year: req.params.year });

  if (payments.length) res.json(payments);
  else res.sendStatus(404);

});