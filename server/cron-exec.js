var mongoose = require('mongoose');
var async = require("async");

var config = require("./config/config");

mongoose.Promise = global.Promise;
mongoose.plugin(require('mongoose-write-stream'));
mongoose.plugin(require('mongoose-paginate'));
mongoose.connect('mongodb://localhost/' + config.database.db, { useMongoClient: true });
console.log("DB connecting to database " + config.database.db);

var tasks = process.argv.slice(2).map(task => require("./cron/" + task));

async.series(tasks,err => {
  if(err) console.error(err.message);
  else console.log("Task finished.");
  
  console.log("Disconnecting DB");
  
  mongoose.disconnect(() => {
    process.exit();
  });
});