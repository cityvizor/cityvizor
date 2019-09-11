import { cronInit } from './worker/index';
import { checkImportQueue } from './worker/index';

(async function(){

  await cronInit();

  setInterval(() => checkImportQueue(), 10000)

})();