import {checkImportQueue, cronInit} from './worker/index';

(async () => {
  await cronInit();

  setInterval(() => checkImportQueue(), 10000);
})();
