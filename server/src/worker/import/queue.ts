import {DateTime} from 'luxon';
import {readdir, remove} from 'fs-extra';
import path from 'path';
import {ImportRecord} from '../../schema/database/import';
import {db} from '../../db';
import {Importer} from './importer';
import config from '../../config';
import {YearRecord} from '../../schema';
import logger from './logger';

export async function checkImportQueue() {
  const runningJob = await db<ImportRecord>('app.imports')
    .where({status: 'processing'})
    .first();

  if (runningJob) {
    const startedBeforeMinutes =
      -1 * DateTime.fromJSDate(runningJob.started).diffNow('minutes').minutes;

    // let the previous job run
    if (startedBeforeMinutes < 1) return;
    // clear the old job with timeout
    else {
      console.log('[WORKER] Found a stale job in queue, removing.');

      const updateData: Partial<ImportRecord> = {
        status: 'error',
        error: 'Job timed out without proper finish.',
        finished: DateTime.local().toJSDate(),
      };

      await db<ImportRecord>('app.imports')
        .where({id: runningJob.id})
        .update(updateData);

      // remove used import data
      const importDir = path.resolve(
        config.storage.imports,
        'import_' + runningJob.id
      );
      await remove(importDir);
    }
  }

  const currentJob = await db<ImportRecord>('app.imports')
    .where({status: 'pending'})
    .orderBy('created', 'asc')
    .first();
  if (!currentJob) return;

  console.log(
    `[WORKER] ${DateTime.local().toJSDate()} Found a new job, starting import.`
  );

  await db<ImportRecord>('app.imports')
    .where({id: currentJob.id})
    .update({status: 'processing', started: DateTime.local().toJSDate()});
  // start import and prepare the transaction
  logger.log('Starting the DB transaction.');
  const trx = await db.transaction();
  const importer = new Importer({
    profileId: currentJob.profileId,
    year: currentJob.year,
    transaction: trx,
  });

  let error: Error;

  const importDir = path.resolve(
    config.storage.imports,
    'import_' + currentJob.id
  );

  try {
    // get all files to be imported
    const dirFiles = await readdir(importDir);

    // identify the usable files in dir
    const dataFile = dirFiles.filter(file => file.match(/^.*data.*\.csv/i))[0];
    const eventsFile = dirFiles.filter(file =>
      file.match(/^.*events.*\.csv/i)
    )[0];
    const paymentsFile = dirFiles.filter(file =>
      file.match(/^.*payments.*\.csv/i)
    )[0];
    const accountingFile = dirFiles.filter(file =>
      file.match(/^.*accounting.*\.csv/i)
    )[0];

    // add path and make Importer.OptionFiles object
    const files: Importer.OptionsFiles = {
      dataFile: dataFile ? path.join(importDir, dataFile) : null,
      eventsFile: eventsFile ? path.join(importDir, eventsFile) : null,
      paymentsFile: paymentsFile ? path.join(importDir, paymentsFile) : null,
      accountingFile: accountingFile
        ? path.join(importDir, accountingFile)
        : null,
    };

    Object.keys(files)
      .filter(k => files[k])
      .forEach(k => logger.log(`Found ${k} for import.`));
    if (!Object.keys(files).some(k => files[k])) {
      logger.log('Failed to find any files for import.');
      return;
    }

    // Drop the records if not appending.
    if (!currentJob.append) {
      if (paymentsFile) {
        await trx('data.payments')
          .where({profileId: currentJob.profileId, year: currentJob.year})
          .delete();
        logger.log('Deleted previous payment records from the DB.');
      }
      if (eventsFile) {
        await trx('data.events')
          .where({profileId: currentJob.profileId, year: currentJob.year})
          .delete();
        logger.log('Deleted previous event records from the DB.');
      }
      if (accountingFile) {
        await trx('data.accounting')
          .where({profileId: currentJob.profileId, year: currentJob.year})
          .delete();
        logger.log('Deleted previous accounting records from the DB.');
      }
      if (dataFile) {
        await trx('data.payments')
          .where({profileId: currentJob.profileId, year: currentJob.year})
          .delete();
        await trx('data.accounting')
          .where({profileId: currentJob.profileId, year: currentJob.year})
          .delete();
        logger.log(
          'Deleted previous payment and accounting records from the DB.'
        );
      }
    }

    // import the files
    console.log('Importing data');
    await importer.import(files);
    console.log('Finished importing data');

    await db<YearRecord>('app.years')
      .where({profileId: currentJob.profileId, year: currentJob.year})
      .update({validity: currentJob.validity});
  } catch (err) {
    console.error(`[WORKER] ${DateTime.local().toJSDate()} Import error`, err);
    logger.log(`Import failed: ${err.message}`);
    logger.log(`Additonal information: ${err.detail}`);
    error = err;
  } finally {
    // remove used import data
    if (error) {
      logger.log('Aborting the DB transaction, no changes made to the DB.');
      trx.rollback();
    } else {
      logger.log('Import successful, committing the DB transaction.');
      trx.commit();
    }
    await remove(importDir);
  }

  console.log('___LOGS____');
  console.log(logger.getLogs());
  console.log('____________');

  const updateData: Partial<ImportRecord> = {
    status: error ? 'error' : 'success',
    error: error ? error.message : null,
    finished: DateTime.local().toJSDate(),
    logs: logger.getLogs(),
  };

  logger.clear();
  await db<ImportRecord>('app.imports')
    .where({id: currentJob.id})
    .update(updateData);

  console.log(`[WORKER] ${DateTime.local().toJSDate()} Import finished.`);
}
