/* tslint:disable:no-console */
import {DateTime} from 'luxon';
import {CronJob} from 'cron';

import {ensureDirs} from '../file-storage';
import {dbConnect} from '../db';

import config from '../config';
import {runTasks} from './run-tasks';
import {cronTasks, updateTasks} from './tasks';
import {checkImportQueue} from '../worker/index';

export async function cronInit() {
  await ensureDirs();

  await dbConnect();

  const dailyJob = new CronJob({
    cronTime: config.cron.cronTime, // '00 00 01 * * *',
    start: true /* Set the job right now */,
    runOnInit: config.cron.runOnInit /* Run the tasks right now */,
    timeZone: 'Europe/Prague' /* Time zone of this job. */,
    onTick: () => runCron(),
  });

  const importJob = new CronJob({
    cronTime: '*/10 * * * * *', // Every 10 seconds
    start: true /* Set the job right now */,
    runOnInit: true /* Run the tasks right now */,
    timeZone: 'Europe/Prague' /* Time zone of this job. */,
    onTick: () => checkImportQueue(),
  });

  // TODO make cron time for update configurable
  const updateJob = new CronJob({
    cronTime: '* */10 * * *', // Every 10 minutes
    start: false, // Setting this to true triggers the job every time a change to code is made in dev mode
    runOnInit: true /* Run the tasks right now */,
    timeZone: 'Europe/Prague' /* Time zone of this job. */,
    onTick: () => runUpdate(),
  });

  if (!dailyJob.running) {
    dailyJob.start();
  }
  importJob.start();
  updateJob.start();

  console.log('[CRON] CityVizor daily job set at ' + config.cron.cronTime);
}

async function runCron() {
  console.log('\n[CRON] =============================');
  console.log('[CRON] ##### CRON RUN #####');
  console.log('[CRON] =============================');

  console.log(`[CRON] Started at ${DateTime.local().toLocaleString()}.\n`);

  await runTasks(cronTasks);

  console.log('[CRON] ===================================\n\n');
  console.log(`[CRON] Finished at ${DateTime.local().toLocaleString()}.\n`);
}

async function runUpdate() {
  console.log('\n[CRON] =============================');
  console.log('[CRON] ##### CRON RUN UPDATE JOB #####');
  console.log('[CRON] =============================');

  console.log(`[CRON] Started at ${DateTime.local().toLocaleString()}.\n`);

  await runTasks(updateTasks);

  console.log('[CRON] ===================================\n\n');
  console.log(`[CRON] Finished at ${DateTime.local().toLocaleString()}.\n`);
}
