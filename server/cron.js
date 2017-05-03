var CronJob = require('cron').CronJob;

function runTaskLoop(tasks){
  let task = tasks.shift();
  
  if(!task) {
    console.log("Finished!");
    return;
  }
  
  task(() => {
    console.log("===================================");
    setTimeout(() => runTaskLoop(tasks),5000);
  });
}

var job = new CronJob({
  cronTime: '00 00 01 * * *',
  onTick: function() {
    
    var tasks = [];
    
    tasks.push(require("./tasks/export-budgets-json"));
    tasks.push(require("./tasks/export-profiles-json"));
    tasks.push(require("./tasks/update-contracts"));
    tasks.push(require("./tasks/export-entities-json"));
    
    console.log("##### MIDNIGHT CRON RUN #####");
    
    runTaskLoop(tasks);
  },
  start: true, /* Start the job right now */
  runOnInit: true,
  timezone: 'Europe/Prague' /* Time zone of this job. */
});