import dotenv from 'dotenv';
dotenv.config();
import {cronInit} from './worker/index';

(async () => {
  await cronInit();
})();
