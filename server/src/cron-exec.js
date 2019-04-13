var mongoose = require('mongoose');
var async = require("async");

var mongoose = require("./db");

var tasks = process.argv.slice(2).map(task => require("./tasks/" + task));

runTasks(tasks)
  .then(() => {
    console.log("Disconnecting DB");

    mongoose.disconnect(() => {
      process.exit();
    });
  });

async function runTasks(tasks){

  console.log("=========");
  
  while(tasks.length){
    
    let task = tasks.shift();
    
    if(typeof task !== "function") {
      console.error("Task must be a function. Instead: " + (typeof task));
      continue;
    }
    
    try{
      await task();
      console.log("Task finished.");
    }catch(err){
      console.error("Error: " + err.message);
    }
  }
   
}