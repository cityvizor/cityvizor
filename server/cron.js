var CronJob = require('cron').CronJob;
var mongoose = require('mongoose');
var moment = require("moment");
var async = require("async");

var config = require("./config/config");

console.log("Setting up CityVizor cron job at " + config.cron.time);

var job = new CronJob({
  cronTime: config.cron.cronTime, //'00 00 01 * * *',
  start: config.cron.start, /* Start the job right now */
  runOnInit: false,
  timezone: 'Europe/Prague', /* Time zone of this job. */
  onTick: runCron()
});

async function runCron() {

  console.log("##### MIDNIGHT CRON RUN #####");
  console.log("Node version: " + process.version);
  console.log("Started at " + moment().format("D. M. YYYY, H:mm:ss") + ".");

  mongoose.Promise = global.Promise;
  mongoose.plugin(require('mongoose-write-stream'));
  mongoose.plugin(require('mongoose-paginate'));

  console.log("DB connecting to database " + config.database.db);

  // set the tasks
  var tasks = [];

  tasks.push({exec: () => mongoose.connect('mongodb://localhost/' + config.database.db), name: "Connect database"});
  tasks.push({exec: require("./tasks/download-contracts"), name: "Download contacts from https://smlouvy.gov.cz/"});
  tasks.push({exec: require("./tasks/download-noticeboard"), name: "Download notice board documents from https://eDesky.cz/"});
  tasks.push({exec: require("./tasks/autoimports"), name: "Process auto imports of data"});

  // function to run each task

  console.log("Starting tasks...");

  while(tasks.length){

    let task = tasks.shift();

    console.log("===================================");
    console.log("Task: " + task.name);

    try{
      await task.exec()
      console.log("Task finished.");
    }catch(err){
      console.error("Error: " + err.message);
    }

    await new Promise((resolve,reject) => setTimeout(resolve,config.cron.jobDelay * 1000));
    
  }

  console.log("Disconnecting DB");
  await mongoose.disconnect();

  console.log("Finished at " + moment().format("D. M. YYYY, H:mm:ss") + "!");

}
