/* tslint:disable:no-console */
import {DateTime} from 'luxon';
import {CronJob} from 'cron';

import {ensureDirs} from '../file-storage';
import {dbConnect} from '../db';

import config from '../config';
import {runTasks} from './run-tasks';

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

  if (!dailyJob.running) {
    dailyJob.start();
  }

  console.log('[CRON] CityVizor daily job set at ' + config.cron.cronTime);
}

async function runCron() {
  console.log('\n[CRON] =============================');
  console.log('[CRON] ##### CRON RUN #####');
  console.log('[CRON] =============================');

  console.log(`[CRON] Started at ${DateTime.local().toLocaleString()}.\n`);

  await runTasks();

  console.log('[CRON] ===================================\n\n');
  console.log(`[CRON] Finished at ${DateTime.local().toLocaleString()}.\n`);
}
