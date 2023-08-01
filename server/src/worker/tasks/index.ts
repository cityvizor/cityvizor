import {TaskDownloadContracts} from './download-contracts';
import {TaskDownloadNoticeboards} from './download-noticeboards';

import {CronTask} from '../../schema/cron';
import {TaskDownloadYears} from './download-years';

export const cronTasks: CronTask[] = [
  TaskDownloadContracts,
  TaskDownloadNoticeboards,
];

export const updateTasks: CronTask[] = [TaskDownloadYears];
