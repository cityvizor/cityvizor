var tasks = process.argv.slice(2).map(task => require("./tasks/" + task));

runTasks(tasks).then(() => console.log("Finished"));

async function runTasks(tasks){
  

  console.log("=========");
  
  for(let task of tasks){

    
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