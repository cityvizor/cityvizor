import express from 'express';
import {db} from '../../db';
import {YearRecord} from '../../schema';
import {ImportRecord} from '../../schema/database/import';

import acl from 'express-dynacl';

const router = express.Router({mergeParams: true});

export const AdminProfileYearsRouter = router;

export type YearRecordWithImportStatus = YearRecord &
  Pick<ImportRecord, 'status' | 'created'>;

router.get('/', acl('profile-years:list'), async (req, res) => {
  // select status and last time for the latest import
  const years = await db<YearRecordWithImportStatus[]>('app.years AS y')
    .select(
      db.raw('distinct on (??) y.*, ??, GREATEST(??) as status_time', [
        [
          'y.profileId',
          'y.year',
          'y.importUrl',
          'y.importFormat',
          'y.importPeriodMinutes',
        ],
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
      {column: 'y.importUrl', order: 'asc'},
      {column: 'y.importFormat', order: 'asc'},
      {column: 'y.importPeriodMinutes', order: 'asc'},
      {
        column: 'i.id',
        order: 'desc',
      },
    ]);

  res.json(years);
});

router.put('/:year', acl('profile-years:write'), async (req, res) => {
  const data = {
    profile_id: req.params.profile,
    year: req.params.year,
    hidden: req.body.hidden,
    import_url: req.body.importPeriodMinutes,
    import_format: req.body.importFormat,
    import_period_minutes: req.body.importPeriodMinutes,
  };

  try {
    await db('app.years').insert(data);
  } catch (err) {
    const existingYear = await db('app.years').where(data).first();
    if (existingYear) return res.status(200).send('Year already exists.');
  }

  return res.sendStatus(201);
});

router.patch('/:year', acl('profile-years:write'), async (req, res) => {
  const updateData: Partial<YearRecord> = {};
  if (req.body.hidden) {
    updateData.hidden = req.body.hidden;
  }
  if (req.body.importUrl) {
    updateData.import_url = req.body.importUrl;
  }
  if (req.body.importFormat) {
    updateData.import_format = req.body.importFormat;
  }
  if (req.body.importPeriodMinutes) {
    updateData.import_period_minutes = req.body.importPeriodMinutes;
  }

  if (updateData) {
    await db<YearRecord>('app.years')
      .where('profile_id', req.params.profile)
      .andWhere('year', Number(req.params.year))
      .update(updateData);
  }

  res.sendStatus(204);
});

router.delete('/:year', acl('profile-years:write'), async (req, res) => {
  await db<YearRecord>('app.years')
    .where('profile_id', req.params.profile)
    .andWhere('year', Number(req.params.year))
    .delete();

  res.sendStatus(204);
});
