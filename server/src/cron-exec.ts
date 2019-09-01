
import { runTasks } from "./tasks";
import { dbConnect, dbDisconnect } from "./db";


(async function () {


  var tasks = process.argv.slice(2);

  if (!tasks.length) tasks = undefined;

  await dbConnect();

  console.log(`Running ${tasks.length} tasks...`);

  await runTasks(tasks);

  console.log("All tasks finished.")

  await dbDisconnect();

})();