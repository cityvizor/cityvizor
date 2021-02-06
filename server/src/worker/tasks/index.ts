import {TaskDownloadContracts} from './download-contracts';
import {TaskDownloadNoticeboards} from './download-noticeboards';

import {CronTask} from '../../schema/cron';
import {InternetStream} from './download-internetstream';

export const cronTasks: CronTask[] = [
  TaskDownloadContracts,
  TaskDownloadNoticeboards,
];

export const updateTasks: CronTask[] = [InternetStream];
