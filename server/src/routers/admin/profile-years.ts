import express from 'express';
import {db} from '../../db';
import {YearRecord} from '../../schema';
import {ImportRecord} from '../../schema/database/import';

import acl from 'express-dynacl';

const router = express.Router({mergeParams: true});

export const AdminProfileYearsRouter = router;

export type YearRecordWithImportStatus = YearRecord &
  Pick<ImportRecord, 'status' | 'created'>;

router.get('/', acl('profile-years', 'list'), async (req, res) => {
  // select status and last time for the latest import
  const years = await db<YearRecordWithImportStatus[]>('app.years AS y')
    .select(
      db.raw('distinct on (??) y.*, ??, GREATEST(??) as status_time', [
        ['y.profileId', 'y.year'],
        'i.status',
        ['i.created', 'i.started', 'i.finished'],
      ])
    )
    .leftJoin('app.imports AS i', {
      'i.profileId': 'y.profileId',
      'i.year': 'y.year',
    })
    .where({'y.profileId': req.params.profile})
    .orderBy([
      {column: 'y.profileId', order: 'asc'},
      {column: 'y.year', order: 'asc'},
      {
        column: 'i.id',
        order: 'desc',
      },
    ]);

  res.json(years);
});

router.put('/:year', acl('profile-years', 'write'), async (req, res) => {
  const data = {profile_id: req.params.profile, year: req.params.year};

  try {
    await db('app.years').insert(data);
  } catch (err) {
    const existingYear = await db('app.years').where(data).first();
    if (existingYear) return res.status(200).send('Year already exists.');
  }

  return res.sendStatus(201);
});

router.patch('/:year', acl('profile-years', 'write'), async (req, res) => {
  await db<YearRecord>('app.years')
    .where('profile_id', req.params.profile)
    .andWhere('year', Number(req.params.year))
    .update(req.body);

  res.sendStatus(204);
});

router.delete('/:year', acl('profile-years', 'write'), async (req, res) => {
  await db<YearRecord>('app.years')
    .where('profile_id', req.params.profile)
    .andWhere('year', Number(req.params.year))
    .delete();

  res.sendStatus(204);
});
