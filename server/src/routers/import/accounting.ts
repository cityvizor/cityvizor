import express from 'express';

import path from 'path';
import multer from 'multer';
import acl from 'express-dynacl';
import schema from 'express-jsonschema';

import extract from 'extract-zip';
import fs from 'fs-extra';

import config from '../../config';

import {db} from '../../db';
import {YearRecord, ProfileRecord} from '../../schema';
import {ImportRecord} from '../../schema/database/import';
import {ensureDir, move} from 'fs-extra';
import {DateTime} from 'luxon';
import crypto from "crypto"

const router = express.Router();

export const ImportAccountingRouter = router;

const importAccountingSchema = {
  body: {
    type: 'object',
    properties: {
      year: {type: 'string'},
      validity: {type: 'string', format: 'date'},
    },
    required: ['year'],
    additionalProperties: false,
  },
};

enum FileType {
  DATA_FILE = 'data',
  PAYMENTS_FILE = 'payments',
  EVENTS_FILE = 'events',
  ACCOUNTING_FILE = 'accounting',
}

const upload = multer({dest: config.storage.tmp});

// POST requests overwrite the current data.
// PATCH requests append the new data to the existing data.

router.post(
  '/profiles/:profile/payments',
  upload.fields([{name: 'payments'}]),
  schema.validate(importAccountingSchema),
  acl('profile-accounting:write'),
  async (req, res) => {
    return createWorkerTask(req, res, FileType.PAYMENTS_FILE, false);
  }
);

router.patch(
  '/profiles/:profile/payments',
  upload.fields([{name: 'payments'}]),
  schema.validate(importAccountingSchema),
  acl('profile-accounting:write'),
  async (req, res) => {
    return createWorkerTask(req, res, FileType.PAYMENTS_FILE, true);
  }
);

router.post(
  '/profiles/:profile/events',
  upload.fields([{name: 'events'}]),
  schema.validate(importAccountingSchema),
  acl('profile-accounting:write'),
  async (req, res) => {
    return createWorkerTask(req, res, FileType.EVENTS_FILE, false);
  }
);

router.patch(
  '/profiles/:profile/events',
  upload.fields([{name: 'events'}]),
  schema.validate(importAccountingSchema),
  acl('profile-accounting:write'),
  async (req, res) => {
    return createWorkerTask(req, res, FileType.EVENTS_FILE, true);
  }
);
router.post(
  '/profiles/:profile/data',
  upload.fields([{name: 'data'}]),
  schema.validate(importAccountingSchema),
  acl('profile-accounting:write'),
  async (req, res) => {
    return createWorkerTask(req, res, FileType.DATA_FILE, false);
  }
);

router.patch(
  '/profiles/:profile/data',
  upload.fields([{name: 'data'}]),
  schema.validate(importAccountingSchema),
  acl('profile-accounting:write'),
  async (req, res) => {
    return createWorkerTask(req, res, FileType.DATA_FILE, true);
  }
);

router.patch(
  '/profiles/:profile/accounting',
  upload.fields([{name: 'accounting'}]),
  schema.validate(importAccountingSchema),
  acl('profile-accounting:write'),
  async (req, res) => {
    return createWorkerTask(req, res, FileType.ACCOUNTING_FILE, true);
  }
);

async function createWorkerTask(req, res, type: FileType, isAppend: boolean) {
  // When file missing throw error immediately
  if (!req.files || !req.files[type.toString()])
    return res.status(400).send('Missing data file or zip file');
  if (isNaN(req.body.year)) return res.status(400).send('Invalid year value');

  // check if tokenCode in profile is same as in token. if not, the token has been revoked (revoke all current tokens by changing the code)
  const profile = await db<ProfileRecord>('app.profiles')
    .select('id', 'tokenCode')
    .where({id: req.params.profile})
    .first();
  if (
    !profile ||
    (req.user.tokenCode && req.user.tokenCode !== profile.tokenCode)
  )
    return res.status(403).send('Token revoked.');

  // check if imported year is created, if not create a new hidden year
  let year: YearRecord | undefined = await db<YearRecord>('app.years')
    .where({profileId: req.params.profile, year: req.body.year})
    .first();

  if (!year) {
    const yearInsert: YearRecord = await db<YearRecord>('app.years')
      .insert(
        {
          profileId: Number(req.params.profile),
          year: req.body.year,
        },
        ['profileId', 'year']
      )
      .then();
    year = yearInsert ? yearInsert[0] : null;
    if (!year)
      return res
        .status(500)
        .send('Failed to create new accounting year in database.');
  }

  const dirName = crypto.randomBytes(64).toString("hex")
  const importDir = path.join(config.storage.imports, dirName);
  await ensureDir(importDir);

  if (req.files[type.toString()] && req.files[type.toString()][0]) {
    await move(
      req.files[type.toString()][0].path,
      path.join(importDir, `${type.toString()}.csv`)
    );
  }
  // add import task to database queue (worker checks the table)
  const importData: Partial<ImportRecord> = {
    profileId: year.profileId,
    year: year.year,

    userId: req.user ? req.user.id : undefined,

    created: DateTime.local().toJSDate(),

    status: 'pending',
    error: undefined,

    validity: req.body.validity || undefined,
    append: isAppend,
    dirName: dirName
  };

  const result = await db<ImportRecord>('app.imports').insert(importData, [
    'id',
  ]);
  const importId = result ? result[0].id : null;

  if (!importId)
    return res.status(500).send('Failed to create import record in database.');



  // get the current full task info (including default values etc.) and return it to the client
  const importDataFull = await db<ImportRecord>('app.imports')
    .where({id: importId})
    .first();

  res.json(importDataFull);
}

// Technical debt for historial reasons to not break backwards compatibility.
// TODO: Properly refactor this one day. Keeping this code to enable upload via ZIP.
// Ginis imports the data using the .zip functionality.
router.post(
  '/profiles/:profile/accounting',
  upload.fields([
    {name: 'accounting', maxCount: 1},
    {name: 'zipFile', maxCount: 1},
  ]),
  schema.validate(importAccountingSchema),
  acl('profile-accounting:write'),
  async (req, res) => {
    const reqFiles = req.files as {[fieldname: string]: Express.Multer.File[]};

    // When file missing throw error immediately
    if (!reqFiles || !reqFiles.accounting || !reqFiles.zipFile) {
      return res.status(400).send('Missing data file or zip file');
    }
    if (isNaN(req.body.year)) {
      return res.status(400).send('Invalid year value');
    }

    // check if tokenCode in profile is same as in token. if not, the token has been revoked (revoke all current tokens by changing the code)
    const profile = await db<ProfileRecord>('app.profiles')
      .select('id', 'tokenCode')
      .where('id', req.params.profile)
      .first();

    if (
      !profile ||
      (req.user.tokenCode && req.user.tokenCode !== profile.tokenCode)
    )
      return res.status(403).send('Token revoked.');

    // check if imported year is created, if not create a new hidden year
    let year: YearRecord | undefined = await db<YearRecord>('app.years')
      .where('profileId', req.params.profile)
      .andWhere('year', req.body.year)
      .first();

    if (!year) {
      const yearInsert: YearRecord = await db<YearRecord>('app.years')
        .insert(
          {
            profileId: Number(req.params.profile),
            year: req.body.year,
          },
          ['profileId', 'year']
        )
        .then();
      year = yearInsert ? yearInsert[0] : null;
      if (!year)
        return res
          .status(500)
          .send('Failed to create new accounting year in database.');
    }

    const importDir = 
    // add import task to database queue (worker checks the table)
    const importData: Partial<ImportRecord> = {
      profileId: year.profileId,
      year: year.year,

      userId: req.user ? req.user.id : undefined,

      created: DateTime.local().toJSDate(),

      status: 'pending',
      error: undefined,

      validity: req.body.validity || undefined,
      append: false,
    };

    const result = await db<ImportRecord>('app.imports').insert(importData, [
      'id',
    ]);
    const importId = result ? result[0].id : null;

    if (!importId)
      return res
        .status(500)
        .send('Failed to create import record in database.');

    // if task created move the uploaded data and possibly unzip them if zip provided
    const importDir = path.join(config.storage.imports, 'import_' + importId);

    await ensureDir(importDir);

    if (reqFiles.zipFile && reqFiles.zipFile[0]) {
      await extractZip(reqFiles.zipFile[0].path, importDir);
    } else {
      if (reqFiles.accounting && reqFiles.accounting[0])
        await move(
          reqFiles.accounting[0].path,
          path.join(importDir, 'accounting.csv')
        );
    }

    // get the current full task info (including default values etc.) and return it to the client
    const importDataFull = await db<ImportRecord>('app.imports')
      .where({id: importId})
      .first();

    return res.json(importDataFull);
  }
);

async function extractZip(zipFile: string, unzipDir: string) {
  try {
    extract(zipFile, {dir: unzipDir});
  } catch (e) {
    throw new Error('Unable to extract ZIP file: ' + e.message);
  }

  const extractedFiles = await fs.readdir(unzipDir);

  return {
    dataFile: extractedFiles.filter(file => file.match(/data/i))[0],
    eventsFile: extractedFiles.filter(file => file.match(/events/i))[0],
    paymentsFile: extractedFiles.filter(file => file.match(/payments/i))[0],
  };
}
