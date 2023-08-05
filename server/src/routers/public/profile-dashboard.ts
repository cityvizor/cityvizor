import express, {Request} from 'express';

import {db} from '../../db';

const router = express.Router({mergeParams: true});

export const ProfileDashboardRouter = router;

router.get('/', async (req: Request<{profile: string}>, res) => {
  const categoriesDef = [
    {name: 'transportation', where: 'paragraph >= 2200 AND paragraph <= 2299'},
    {name: 'schools', where: 'paragraph >= 3100 AND paragraph <= 3299'},
    {name: 'housing', where: 'paragraph >= 3600 AND paragraph <= 3699'},
    {name: 'culture', where: 'paragraph >= 3300 AND paragraph <= 3399'},
    {name: 'sports', where: 'paragraph >= 3400 AND paragraph <= 3499'},
    {name: 'government', where: 'paragraph >= 6100 AND paragraph <= 6199'},
  ];

  const categoriesNames = db.unionAll(
    categoriesDef.map(category => {
      return db.raw(`SELECT '${category.name}' AS category`);
    })
  );

  const categoriesAccounting = db.unionAll(
    categoriesDef.map(category => {
      return db('accounting')
        .select(
          'profile_id',
          'year',
          db.raw(`'${category.name}' AS category`),
          'expenditureAmount',
          'budgetExpenditureAmount'
        )
        .whereRaw(category.where);
    })
  );

  const amounts = db('years AS y')
    .crossJoin(categoriesNames.as('n'), {})
    .leftJoin(categoriesAccounting.as('a'), {
      'a.year': 'y.year',
      'a.category': 'n.category',
      'a.profileId': 'y.profileId',
    })
    .select('y.year', 'n.category')
    .sum('a.expenditureAmount AS amount')
    .sum('a.budgetExpenditureAmount AS budgetAmount')
    .where({'y.profileId': req.params.profile})
    .groupBy('y.year', 'n.category');

  res.send(await amounts);
});
