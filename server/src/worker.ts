import {cronInit} from './worker/index';
import {checkImportQueue} from './worker/index';

(async () => {
  await cronInit();

  setInterval(() => checkImportQueue(), 10000);
})();
