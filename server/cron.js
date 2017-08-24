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

      tasks.push(require("./cron/export-profiles-csv"));
      tasks.push(require("./cron/export-budgets-csv"));
      tasks.push(require("./cron/download-contracts"));

      console.log("Starting tasks...");
      // loop through the tasks one by one
      runTaskLoop(tasks,() => {

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

function runTaskLoop(tasks,cb){
  let task = tasks.shift();

  if(!task) return cb();

  console.log("===================================");

  task(() => {
    console.log("===================================");
    console.log("Wait " + config.cron.jobDelay + " sec");

    if(tasks.length) setTimeout(() => runTaskLoop(tasks,cb),config.cron.jobDelay * 1000);
    else return cb();
  });
}