import express from 'express';
import archiver from 'archiver';
import Knex from 'knex';
import CsvStringify from 'csv-stringify';
import {db} from '../../db';
import config from '../../config';

import {
  ProfileRecord,
  AccountingRecord,
  PaymentRecord,
  EventRecord,
} from '../../schema';

import {exportQuery} from './tools/export';

const router = express.Router();

export const ExportProfilesRouter = router;

const accountingQuery = (params): Knex.QueryBuilder => {
  return db<AccountingRecord>('accounting')
    .where('profileId', params.profile)
    .andWhere('year', params.year);
};

const eventsQuery = (params): Knex.QueryBuilder => {
  const amounts = db('accounting')
    .select('profileId', 'year', 'event')
    .sum('incomeAmount as incomeAmount')
    .sum('budgetIncomeAmount as budgetIncomeAmount')
    .sum('expenditureAmount as expenditureAmount')
    .sum('budgetExpenditureAmount as budgetExpenditureAmount')
    .whereRaw('event IS NOT NULL')
    .groupBy('profileId', 'year', 'event');

  return db<EventRecord>('events as e')
    .leftJoin(amounts.as('a'), {
      'a.profileId': 'e.profileId',
      'a.year': 'e.year',
      'a.event': 'e.id',
    })
    .select(
      'e.year',
      'e.id',
      'e.name',
      'a.incomeAmount',
      'a.budgetIncomeAmount',
      'a.expenditureAmount',
      'a.budgetExpenditureAmount'
    )
    .where({'e.profileId': params.profile, 'e.year': params.year});
};

const paymentsQuery = (params): Knex.QueryBuilder => {
  return db<PaymentRecord>('payments')
    .where('profile_id', params.profile)
    .andWhere('year', params.year);
};

router.get('/', async (req, res) => {
  const profiles = db<ProfileRecord>('profiles')
    .select(
      'id',
      'name',
      'email',
      'ico',
      'databox',
      'edesky',
      'mapasamospravy',
      'gps_x',
      'gps_y'
    )
    .select(db.raw(`CONCAT('${config.url}','/profiles/',url) AS url`))
    .where({status: 'visible'});

  exportQuery(req, res, profiles, 'profiles');
});

router.get('/:profile/years', async (req, res) => {
  const years = db('years as y')
    .select('y.year', 'y.validity')
    .sum('a.expenditureAmount as expenditureAmount')
    .sum('a.budgetExpenditureAmount as budgetExpenditureAmount')
    .sum('a.incomeAmount as incomeAmount')
    .sum('a.budgetIncomeAmount as budgetIncomeAmount')
    .leftJoin('accounting as a', {
      'a.profileId': 'y.profileId',
      'a.year': 'y.year',
    })
    .where({'y.profile_id': req.params.profile})
    .groupBy('y.profileId', 'y.year', 'y.validity');

  exportQuery(req, res, years, `profile-${req.params.profile}-years`);
});

router.get('/:profile/accounting/:year', async (req, res) => {
  exportQuery(
    req,
    res,
    accountingQuery(req.params),
    `profile-${req.params.profile}-accounting`
  );
});

router.get('/:profile/events/:year', async (req, res) => {
  exportQuery(
    req,
    res,
    eventsQuery(req.params),
    `profile-${req.params.profile}-events`
  );
});

router.get('/:profile/payments/:year', async (req, res) => {
  exportQuery(
    req,
    res,
    paymentsQuery(req.params),
    `profile-${req.params.profile}-payments`
  );
});

router.get('/:profile/all/:year', async (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/zip',
    'Content-disposition': `attachment; filename=profile-${req.params.profile}-${req.params.year}.zip`,
  });

  const zip = archiver('zip');
  zip.on('error', err => res.status(500).send(err.message));
  zip.pipe(res);
  const queries: [typeof accountingQuery, string][] = [
    [accountingQuery, 'accounting.csv'],
    [eventsQuery, 'events.csv'],
    [paymentsQuery, 'payments.csv'],
  ];
  for (const [query, name] of queries) {
    const stream = query(req.params).stream();
    req.on('close', stream.end.bind(stream));
    const csv = CsvStringify({delimiter: ',', header: true});
    zip.append(stream.pipe(csv), {name});
  }
  zip.finalize();
});
