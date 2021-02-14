/* tslint:disable:no-console */
import {DateTime} from 'luxon';
import {remove} from 'fs-extra';
import {ImportRecord} from '../../schema/database/import';
import {db} from '../../db';
import {Import} from './import';
import {YearRecord} from '../../schema';
import logger from './logger';
import {importCityvizor} from './cityvizor/importer';
import {importInternetStream} from './internetstream/importer';

export async function checkImportQueue() {
  const runningJob = await db<ImportRecord>('app.imports')
    .where({status: 'processing'})
    .first();

  if (runningJob) {
    const startedBeforeMinutes = runningJob.started
      ? -1 * DateTime.fromJSDate(runningJob.started).diffNow('minutes').minutes
      : 0;

    // let the previous job run
    if (startedBeforeMinutes < 1) return;
    // clear the old job with timeout
    else {
      console.log('[WORKER] Found a stale job in queue, removing.');

      const updateDataStale: Partial<ImportRecord> = {
        status: 'error',
        error: 'Job timed out without proper finish.',
        finished: DateTime.local().toJSDate(),
      };

      await db<ImportRecord>('app.imports')
        .where({id: runningJob.id})
        .update(updateDataStale);

      // remove used import data
      await remove(runningJob.importDir);
    }
  }

  const currentJob = await db<ImportRecord>('app.imports')
    .where({status: 'pending'})
    .orderBy('created', 'asc')
    .first();
  if (!currentJob) return;

  if (!['internetstream', 'cityvizor'].includes(currentJob.format)) {
    throw Error(`Unsupported import format: ${currentJob.format}`);
  }

  console.log(
    `[WORKER] ${DateTime.local().toJSDate()} Found a new ${
      currentJob.format
    } job, starting import.`
  );

  await db<ImportRecord>('app.imports')
    .where({id: currentJob.id})
    .update({status: 'processing', started: DateTime.local().toJSDate()});

  logger.log('Starting the DB transaction.');

  const trx = await db.transaction();
  const options: Import.Options = {
    profileId: currentJob.profileId,
    year: currentJob.year,
    transaction: trx,
    importDir: currentJob.importDir,
    append: currentJob.append,
  };

  // Any exception catched in this try block will rollback the import transaction
  let error: Error | null = null;
  try {
    // TODO: ugly
    if (currentJob.format === 'cityvizor') {
      await importCityvizor(options);
    } else if (currentJob.format == 'internetstream') {
      await importInternetStream(options);
    } else {
      throw Error(`Unsupported import type: ${currentJob.format}`)
    }
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
    await remove(currentJob.importDir);
  }

  console.log('___LOGS____');
  console.log(logger.getLogs());
  console.log('____________');

  const updateData: Partial<ImportRecord> = {
    status: error ? 'error' : 'success',
    error: error ? error.message : null,
    finished: DateTime.local().toJSDate(),
    logs: logger.getLogs(),
  } as Partial<ImportRecord>;

  logger.clear();
  await db<ImportRecord>('app.imports')
    .where({id: currentJob.id})
    .update(updateData);

  console.log(`[WORKER] ${DateTime.local().toJSDate()} Import finished.`);
}
