var mongoose = require('mongoose');

var config = require("./config/config");

console.log("##### MIDNIGHT CRON RUN #####");

try {

  mongoose.Promise = global.Promise;
  mongoose.plugin(require('mongoose-write-stream'));
  mongoose.plugin(require('mongoose-paginate'));
  mongoose.connect('mongodb://localhost/' + config.database.db);
  console.log("DB connecting to database " + config.database.db);

  // set the tasks
  var tasks = [];

  tasks.push(require("./cron/export-profiles-json"));
  tasks.push(require("./cron/export-profiles-csv"));
  tasks.push(require("./cron/export-budgets-json"));
  tasks.push(require("./cron/export-budgets-csv"));
  tasks.push(require("./cron/export-events-json"));
  tasks.push(require("./cron/export-events-csv"));
  tasks.push(require("./cron/download-contracts"));

  console.log("Starting tasks...");
  // loop through the tasks one by one
  runTaskLoop(tasks,() => {

    console.log("Disconnecting DB");
    mongoose.disconnect(() => {
      console.log("Finished!");
      process.exit();
    });

  });
}
catch(err) {
  console.log(err);
}

function runTaskLoop(tasks,cb){
  let task = tasks.shift();

  if(!task) return cb();
  
  console.log("===================================");

  task(() => {
    console.log("===================================");
    console.log("Wait " + config.cron.jobDelay + " sec");

    if(tasks.length) setTimeout(() => runTaskLoop(tasks,cb),config.cron.jobDelay * 1000);
    else cb();
  });
}