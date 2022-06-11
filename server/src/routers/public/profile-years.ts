import express from 'express';

import {db} from '../../db';
import {YearRecord} from '../../schema';

const router = express.Router({mergeParams: true});

export const ProfileYearsRouter = router;

const getBaseQuery = (profileId: string) =>
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
  const sumMode = req.query.sumMode ?? 'complete';

  if (sumMode === 'complete') {
    const years = await getBaseQuery(req.params.profile)
      .sum('a.expenditureAmount as expenditureAmount')
      .sum('a.budgetExpenditureAmount as budgetExpenditureAmount')
      .sum('a.incomeAmount as incomeAmount')
      .sum('a.budgetIncomeAmount as budgetIncomeAmount');

    return res.json(years);
  } else if (sumMode === 'visible') {
    const incomeAmounts = await getBaseQuery(req.params.profile)
      .sum('a.incomeAmount as incomeAmount')
      .sum('a.budgetIncomeAmount as budgetIncomeAmount')
      .innerJoin('codelists as c', {
        'c.id': db.raw('SUBSTRING(a.item::varchar, 1, 2)'),
      })
      .where({'c.codelist': 'item-groups'});

    const expenditureAmounts = await getBaseQuery(req.params.profile)
      .sum('a.expenditureAmount as expenditureAmount')
      .sum('a.budgetExpenditureAmount as budgetExpenditureAmount')
      .innerJoin('codelists as c', {
        'c.id': db.raw('SUBSTRING(a.paragraph::varchar, 1, 2)'),
      })
      .where({'c.codelist': 'paragraph-groups'});

    const years = incomeAmounts.map((year, index) => {
      return {
        ...year,
        expenditureAmount: expenditureAmounts[index]?.expenditureAmount ?? 0,
        budgetExpenditureAmount:
          expenditureAmounts[index]?.budgetExpenditureAmount ?? 0,
      };
    });

    return res.json(years);
  } else {
    return res.sendStatus(400);
  }
});

router.get('/:year', async (req, res) => {
  const year = await db<YearRecord>('years')
    .where('profile_id', req.params.profile)
    .andWhere('year', Number(req.params.year));

  res.json(year);
});
