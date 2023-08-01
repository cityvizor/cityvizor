// load express app and export router
import express from 'express';

import {db, getValidDateString, isValidDateString} from '../../db';
import {PaymentRecord} from '../../schema';

const router = express.Router();

export const CounterpartiesRouter = router;

// REQUEST: get event

router.get('/search', async (req, res) => {
  if (!req.query.query) {
    res.status(400).send('Missing parameter query');
    return;
  }

  const counterparties = await db<PaymentRecord>('payments')
    .select('counterpartyId', 'counterpartyName')
    .where('counterpartyName', 'like', '%' + req.query.query + '%')
    .orWhere('counterpartyId', String(req.query.query));

  res.json(counterparties);
});

router.get('/top', async (req, res) => {
  const counterparties = await db<PaymentRecord>('payments')
    .select('counterpartyId')
    .where('profileId', String(req.query.profileId))
    .whereNotNull('counterpartyId')
    .max('counterpartyName as counterpartyName')
    .sum('expenditureAmount as amount')
    .groupBy('counterpartyId')
    .orderBy('amount', 'desc')
    .limit(req.query.limit ? Math.min(Number(req.query.limit), 10000) : 10000)
    .modify(function () {
      if (isValidDateString(req.query.dateFrom)) {
        this.where('date', '>=', getValidDateString(req.query.dateFrom));
      }
      if (isValidDateString(req.query.dateTo)) {
        this.where('date', '<', getValidDateString(req.query.dateTo));
      }
    });

  res.json(counterparties);
});

router.get('/:id', async (req, res) => {
  const counterpartyNames = await db<PaymentRecord>('payments')
    .distinct('counterpartyName as name')
    .count('counterpartyName as c')
    .where('counterpartyId', req.params.id)
    .groupBy('counterpartyName')
    .orderBy('c', 'desc');

  if (!counterpartyNames.length) {
    res.sendStatus(404);
  } else {
    res.json(counterpartyNames);
  }
});

router.get('/:id/accounting', async (req, res) => {
  const years = await db<PaymentRecord>('payments')
    .select('year', 'type')
    .sum({amount: 'amount'})
    .where('counterpartyId', req.params.id)
    .groupBy('year', 'type');

  if (years.length) res.json(years);
  else res.sendStatus(404);
});

router.get('/:id/accounting/:year', async (req, res) => {
  const accounting = await db<PaymentRecord>('payments')
    .select('type', 'item', 'paragraph', 'unit')
    .sum({amount: 'amount'})
    .where('counterpartyId', req.params.id)
    .andWhere('year', req.params.year)
    .groupBy('type', 'item', 'paragraph', 'unit');

  if (accounting.length) res.json(accounting);
  else res.sendStatus(404);
});

router.get('/:id/payments', async (req, res) => {
  const payments = await db<PaymentRecord>('payments as p')
    .leftJoin('events as e', function () {
      this.on('p.event', 'e.id')
        .andOn('p.profileId', 'e.profileId')
        .andOn('p.year', 'e.year');
    })
    .select(
      'p.expenditureAmount as amount',
      'p.date',
      'p.description as description'
    )
    .where({
      'p.counterpartyId': req.params.id,
      'p.profileId': req.query.profileId,
    })
    .modify(function () {
      if (isValidDateString(req.query.dateFrom)) {
        this.where('p.date', '>=', getValidDateString(req.query.dateFrom));
      }
      if (isValidDateString(req.query.dateTo)) {
        this.where('p.date', '<', getValidDateString(String(req.query.dateTo)));
      }
    });

  if (payments.length) res.json(payments);
  else res.sendStatus(404);
});
