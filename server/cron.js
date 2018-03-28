var CronJob = require('cron').CronJob;
var mongoose = require('mongoose');
var moment = require("moment");
var async = require("async");

var config = require("./config/config");

var job = new CronJob({
  cronTime: config.cron.time,//'00 00 01 * * *',
  start: true, /* Start the job right now */
  runOnInit: false,
  timezone: 'Europe/Prague', /* Time zone of this job. */
  onTick: function() {
    
    console.log("##### MIDNIGHT CRON RUN #####");
    console.log("Node version: " + process.version);
    console.log("Started at " + moment().format("D. M. YYYY, H:mm:ss") + ".");

    try {

      mongoose.Promise = global.Promise;
      mongoose.plugin(require('mongoose-write-stream'));
      mongoose.plugin(require('mongoose-paginate'));
      
      console.log("DB connecting to database " + config.database.db);

      // set the tasks
      var tasks = [];
      
      tasks.push({exec: cb => mongoose.connect('mongodb://localhost/' + config.database.db, cb), name: "Connect database"});
      tasks.push({exec: require("./cron/download-contracts"), name: "Download contacts from https://smlouvy.gov.cz/"});
      tasks.push({exec: require("./cron/download-noticeboard"), name: "Download notice board documents from https://eDesky.cz/"});
      tasks.push({exec: require("./cron/autoimports"), name: "Process auto imports of data"});

      // function to run each task
      var runTask = (task,cb) => {
        console.log("===================================");
        console.log("Task: " + task.name);

        task.exec((err) => {
          if(err) console.error("Error: " + err.message);
          else console.log("Task finished.");
          setTimeout(cb,config.cron.jobDelay * 500);
        });
      }
      
      console.log("Starting tasks...");
      
      // loop through the tasks one by one
      async.mapSeries(tasks,runTask,() => {
        console.log("Disconnecting DB");
        mongoose.disconnect(() => {
          console.log("Finished at " + moment().format("D. M. YYYY, H:mm:ss") + "!");
        });
      });
    }
    catch(err) {
      console.error(err);
    }
  }
});