import express from 'express';

import {db} from '../../db';
import {PlanRecord} from '../../schema';

const router = express.Router({mergeParams: true});

export const ProfilePlansRouter = router;
router.get('/', async (req, res) => {
  const years = await db<PlanRecord>('pbo_plans')
    .select('year', 'profileId')
    .sum({incomeAmount: 'incomeAmount'})
    .sum({expenditureAmount: 'expenditureAmount'})
    .sum({budgetIncomeAmount: 'budgetIncomeAmount'})
    .sum({budgetExpenditureAmount: 'budgetExpenditureAmount'})
    .where('profile_id', req.params.profile)
    .groupBy('year', 'profileId');

  if (years.length) res.json(years);
  else res.sendStatus(404);
});

router.get('/:year', async (req, res) => {
  const accounting = await db<PlanRecord>('pbo_plans')
    .where('profileId', req.params.profile)
    .andWhere('year', req.params.year);

  res.json(accounting);
});

router.get('/:year/groups/:field', async (req, res) => {
  const field = req.params.field;

  if (['incomes', 'expenditures'].indexOf(field) === -1)
    return res
      .status(400)
      .send('Parameter field can only have values incomes or expenditures.');

  const groups = await db<PlanRecord>('pbo_plans')
    .select(db.raw('SUBSTRING(sa::varchar, 1, 2) AS id'))
    .sum('incomeAmount as incomeAmount')
    .sum('budgetIncomeAmount as budgetIncomeAmount')
    .sum('expenditureAmount as expenditureAmount')
    .sum('budgetExpenditureAmount as budgetExpenditureAmount')
    .where('profileId', req.params.profile)
    .andWhere('year', req.params.year)
    .andWhereBetween('sa', field === 'expenditures' ? [500, 599] : [600, 699])
    .groupBy('id');

  return res.json(groups);
});

router.get('/:year/groups/:group/details', async (req, res) => {
  const group = Number(req.params.group);
  if (isNaN(group))
    return res.status(400).send('Parameter group must be a number');

  const details = await db('pbo_plans as p')
    .select('p.sa as id')
    .sum('incomeAmount as incomeAmount')
    .sum('budgetIncomeAmount as budgetIncomeAmount')
    .sum('expenditureAmount as expenditureAmount')
    .sum('budgetExpenditureAmount as budgetExpenditureAmount')
    .where('profileId', req.params.profile)
    .andWhere('year', req.params.year)
    .whereRaw('SUBSTRING(p.sa::varchar, 1, 2) = ?', [group])
    .groupBy('id');

  return res.json([
    {
      name: 'Položky v této skupině',
      items: details,
      incomeAmount: details.reduce(
        (acc, detail) => (acc += detail.incomeAmount),
        0
      ),
      budgetIncomeAmount: details.reduce(
        (acc, detail) => (acc += detail.incomeAmount),
        0
      ),
      expenditureAmount: details.reduce(
        (acc, detail) => (acc += detail.expenditureAmount),
        0
      ),
      budgetExpenditureAmount: details.reduce(
        (acc, detail) => (acc += detail.expenditureAmount),
        0
      ),
    },
  ]);
});
