import express from 'express';

import {db, sort2order} from '../../db';
import {ContractRecord} from '../../schema';

const router = express.Router({mergeParams: true});

export const ProfileContractsRouter = router;

router.get('/', async (req, res) => {
  const p_limit = Number(req.query.limit);

  const contracts = await db<ContractRecord>('contracts')
    .where('profile_id', req.params.profile)
    .limit(req.query.limit ? Math.min(p_limit, 100) : p_limit)
    .offset(Number(req.query.offset || 0))
    .modify(function () {
      if (req.query.sort) this.orderBy(sort2order(String(req.query.sort)));
    });

  res.json(contracts);
});
