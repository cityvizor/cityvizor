import express from 'express';

import {db} from '../../db';
import {YearRecord} from '../../schema';

const router = express.Router({mergeParams: true});

export const ProfileYearsRouter = router;

const getYearQuery = (profileId: string) =>
  db('years as y')
    .select('y.profileId', 'y.year', 'y.validity')
    .leftJoin('accounting as a', {
      'a.profileId': 'y.profileId',
      'a.year': 'y.year',
    })
    .where({'y.profile_id': profileId})
    .groupBy('y.profileId', 'y.year', 'y.validity')
    .orderBy('y.year');

router.get('/', async (req, res) => {
  const budgetAmounts = await getYearQuery(req.params.profile)
    .sum('a.budgetExpenditureAmount as budgetExpenditureAmount')
    .sum('a.budgetIncomeAmount as budgetIncomeAmount');

  const incomeAmounts = await getYearQuery(req.params.profile)
    .sum('a.incomeAmount as incomeAmount')
    .innerJoin('codelists as c', {
      'c.id': db.raw('SUBSTRING(a.item::varchar, 1, 2)'),
    })
    .where({'c.codelist': 'item-groups'});

  const expenditureAmounts = await getYearQuery(req.params.profile)
    .sum('a.expenditureAmount as expenditureAmount')
    .innerJoin('codelists as c', {
      'c.id': db.raw('SUBSTRING(a.paragraph::varchar, 1, 2)'),
    })
    .where({'c.codelist': 'paragraph-groups'});

  const years = budgetAmounts.map((year, index) => {
    return {
      ...year,
      incomeAmount: incomeAmounts[index]?.incomeAmount ?? 0,
      expenditureAmount: expenditureAmounts[index]?.expenditureAmount ?? 0,
    };
  });

  res.json(years);
});

router.get('/:year', async (req, res) => {
  const year = await db<YearRecord>('years')
    .where('profile_id', req.params.profile)
    .andWhere('year', Number(req.params.year));

  res.json(year);
});
