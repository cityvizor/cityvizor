var CronJob = require('cron').CronJob;
var moment = require("moment");
var async = require("async");

var config = require("../config");

console.log("Setting up CityVizor cron job at " + config.cron.cronTime);

var job = new CronJob({
  cronTime: config.cron.cronTime, //'00 00 01 * * *',
  start: true, /* Set the job right now */
  runOnInit: config.cron.runOnInit, /* Run the tasks right now */
  timezone: 'Europe/Prague', /* Time zone of this job. */
  onTick: () => runCron()
});

async function runCron() {

  console.log("\n=============================");
  console.log("##### MIDNIGHT CRON RUN #####");
  console.log("=============================");
  
  console.log("\nNode version: " + process.version);
  console.log("Started at " + moment().format("D. M. YYYY, H:mm:ss") + ".\n");
  
  const mongoose = require("./db");

  // set the tasks
  var tasks = [];

  tasks.push({exec: require("./tasks/download-contracts"), name: "Download contacts from https://smlouvy.gov.cz/"});
  tasks.push({exec: require("./tasks/download-noticeboard"), name: "Download notice board documents from https://eDesky.cz/"});
  tasks.push({exec: require("./tasks/autoimports"), name: "Process auto imports of data"});
  tasks.push({exec: () => mongoose.disconnect(), name: "Disconnect database"});

  // function to run each task

  console.log("Starting tasks...");

  while(tasks.length){

    let task = tasks.shift();

    console.log("\n===================================");
    console.log("Task: " + task.name);
    console.log("===================================");

    try{
      await task.exec()
      console.log("Task finished.");
    }catch(err){
      console.error("Error: " + err.message);
    }

    await new Promise((resolve,reject) => setTimeout(resolve,config.cron.jobDelay * 1000));
    
  }

  console.log("===================================\n\n");
  console.log("Finished all at " + moment().format("D. M. YYYY, H:mm:ss") + "!");

}
