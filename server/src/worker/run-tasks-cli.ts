import {dbConnect, dbDestroy} from '../db';
import {runTasks} from './run-tasks';

(async function () {
  const tasks = process.argv.slice(2);

  if (!tasks.length) {
    console.log('Task name not specified');
    process.exit(1);
  }

  await dbConnect();

  console.log(`Running ${tasks.length} tasks...`);

  await runTasks(tasks);

  console.log('All tasks finished.');

  await dbDestroy();
})();
