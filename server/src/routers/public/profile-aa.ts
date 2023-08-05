import express, {Request} from 'express';

import {db} from '../../db';
import {PlanRecord} from '../../schema';
import {AaNameRecord} from '../../schema/database/aaName';

const router = express.Router({mergeParams: true});

const sumField = (arr, field) => arr.reduce((acc, c) => (acc += c[field]), 0);

export const ProfileAaRouter = router;

router.get(
  '/:aa/sa/:sa/history',
  async (req: Request<{profile: string; aa: string; sa: string}>, res) => {
    const qAaRecords = db<AaNameRecord>('data.pbo_aa_names')
      .select('year', 'name')
      .where('profileId', req.params.profile)
      .andWhere('aa', req.params.aa)
      .andWhere('sa', req.params.sa);

    const qRecords = db<PlanRecord>('pbo_plans')
      .select()
      .where('profileId', req.params.profile)
      .andWhere('aa', req.params.aa);

    const [aaRecords, records] = await Promise.all([qAaRecords, qRecords]);

    const years = [...new Set(records.map(r => r.year))];
    const groupedYears = years.map(year => {
      const summed = [
        'incomeAmount',
        'budgetIncomeAmount',
        'expenditureAmount',
        'budgetExpenditureAmount',
      ].reduce((acc, c) => {
        return {
          ...acc,
          [c]: sumField(
            records.filter(record => record.year === year),
            c
          ),
        };
      }, {});
      const name = aaRecords.find(record => record.year === year)?.name;
      return {
        id: req.params.aa,
        name:
          name || `Analytický účet č. ${req.params.aa} (SÚ: ${req.params.sa})`,
        year,
        ...summed,
      };
    });
    res.json(groupedYears);
  }
);

router.get(
  '/:aa/sa/:sa/year/:year',
  async (
    req: Request<{profile: string; year: string; aa: string; sa: string}>,
    res
  ) => {
    const qAaInfo = db<AaNameRecord>('data.pbo_aa_names')
      .select('aa as id', 'name')
      .where('profileId', req.params.profile)
      .andWhere('year', req.params.year)
      .andWhere('aa', req.params.aa)
      .first();

    const qRecords = db('pbo_plans')
      .select()
      .where('year', req.params.year)
      .andWhere('profileId', req.params.profile)
      .andWhere('aa', req.params.aa)
      .andWhere('sa', req.params.sa);

    const [aaInfo, records] = await Promise.all([qAaInfo, qRecords]);
    const summed = [
      'incomeAmount',
      'budgetIncomeAmount',
      'expenditureAmount',
      'budgetExpenditureAmount',
    ].reduce((acc, c) => {
      return {
        ...acc,
        [c]: sumField(records, c),
      };
    }, {});

    const sas = records.map(record => {
      return {
        expenditureAmount: record.expenditureAmount,
        budgetExpenditureAmount: record.budgetExpenditureAmount,
        incomeAmount: record.incomeAmount,
        budgetIncomeAmount: record.budgetIncomeAmount,
        id: record.sa,
      };
    });

    res.json({
      ...(aaInfo || {
        id: req.params.aa,
        name: `Analytický účet č. ${req.params.aa} (SÚ: ${req.params.sa})`,
      }),
      year: req.params.year,
      ...summed,
      paragraphs: sas,
      items: sas,
    });
  }
);
