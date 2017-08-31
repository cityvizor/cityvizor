var CronJob = require('cron').CronJob;
var mongoose = require('mongoose');
var moment = require("moment");

var config = require("./config/config");

console.log("##### MIDNIGHT CRON RUN #####");
console.log("Started at " + moment().format("D. M. YYYY, H:mm:ss") + ".");

var job = new CronJob({
  cronTime: config.cron.time,//'00 00 01 * * *',
  onTick: function() {

    try {

      mongoose.Promise = global.Promise;
      mongoose.plugin(require('mongoose-write-stream'));
      mongoose.plugin(require('mongoose-paginate'));
      mongoose.connect('mongodb://localhost/' + config.database.db);
      console.log("DB connecting to database " + config.database.db);

      // set the tasks
      var tasks = [];
      
      tasks.push({exec: require("./cron/export-profiles-csv"), name: "Export profiles to CSV"});
      tasks.push({exec: require("./cron/export-budgets-csv"), name: "Export budget data to CSV"});
      tasks.push({exec: require("./cron/download-contracts"), name: "Download contacts from https://smlouvy.gov.cz/"});

      console.log("Starting tasks...");
      // loop through the tasks one by one
      runTaskLoop(tasks,1,() => {

        console.log("Disconnecting DB");
        mongoose.disconnect(() => {
          console.log("Finished at " + moment().format("D. M. YYYY, H:mm:ss") + "!");
        });

      });
    }
    catch(err) {
      console.log(err);
    }
  },
  start: true, /* Start the job right now */
  runOnInit: true,
  timezone: 'Europe/Prague' /* Time zone of this job. */
});

function runTaskLoop(tasks,counter,cb){
  let task = tasks.shift();

  console.log("===================================");
  console.log("Task #" + counter + ": " + task.name);

  task.exec(() => {
    console.log("Task finished.");

    if(tasks.length) setTimeout(() => runTaskLoop(tasks,counter + 1,cb),config.cron.jobDelay * 1000);
    else return cb();
  });
}