import express from 'express';

import {db} from '../../db';
import {CodelistRecord} from '../../schema';

const router = express.Router();

export const CodelistsRouter = router;

router.get('/', async (req, res) => {
  const codelists = await db<CodelistRecord>('codelists')
    .distinct('codelist')
    .then(rows => rows.map(row => row.codelist));
  res.json(codelists);
});

router.get('/:name', async (req, res) => {
  const codelist = await db<CodelistRecord>('codelists')
    .select('id', 'name', 'description', 'validFrom', 'validTill')
    .where({codelist: req.params.name});

  if (codelist.length) res.json(codelist);
  else res.sendStatus(404);
});
