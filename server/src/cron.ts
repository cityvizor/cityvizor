import { CronJob } from 'cron';

import config from "./config";
import { DateTime } from 'luxon';

import { db, dbDisconnect, dbConnect } from "./db";
import { runTasks } from './tasks';
import { ensureDirs } from './file-storage';

(async function () {

  await ensureDirs();

  var job = new CronJob({
    cronTime: config.cron.cronTime, //'00 00 01 * * *',
    start: true, /* Set the job right now */
    runOnInit: config.cron.runOnInit, /* Run the tasks right now */
    timeZone: 'Europe/Prague', /* Time zone of this job. */
    onTick: () => runCron()
  });

  console.log("[CRON] CityVizor cron job set at " + config.cron.cronTime);
  
})();

async function runCron() {

  console.log("\n[CRON] =============================");
  console.log("[CRON] ##### CRON RUN #####");
  console.log("[CRON] =============================");

  console.log(`[CRON] Started at ${DateTime.local().toLocaleString()}.\n`);

  await dbConnect();

  await runTasks();

  await dbDisconnect();

  console.log("[CRON] ===================================\n\n");
  console.log(`[CRON] Finished at ${DateTime.local().toLocaleString()}.\n`);

}
