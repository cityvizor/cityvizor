import {TaskDownloadContracts} from './download-contracts';
import {TaskDownloadNoticeboards} from './download-noticeboards';

import {CronTask} from '../../schema/cron';

export const cronTasks: CronTask[] = [
  TaskDownloadContracts,
  TaskDownloadNoticeboards,
];
