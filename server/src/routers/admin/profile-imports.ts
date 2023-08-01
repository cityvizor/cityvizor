import express from 'express';
import {ImportRecord} from '../../schema/database/import';
import {db} from '../../db';

import acl from 'express-dynacl';

const router = express.Router({mergeParams: true});

export const AdminProfileImportsRouter = router;

router.get('/', acl('profile-imports:list'), async (req, res) => {
  const records = await db<ImportRecord>('app.imports')
    .where('profileId', req.params.profile)
    .orderBy('started', 'desc');

  res.json(records);
});
