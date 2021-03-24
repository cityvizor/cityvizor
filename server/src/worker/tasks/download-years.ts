import {YearRecord} from '../../schema';
import {ImportRecord} from '../../schema/database/import';
import {CronTask} from '../../schema/cron';
import {db} from '../../db';
import axios from 'axios';
import * as fs from 'fs-extra';
import path from 'path';
import extract from 'extract-zip';
import {DateTime} from 'luxon';
import {Import} from '../import/import';

export const TaskDownloadYears: CronTask = {
  id: 'download-years',
  name: 'Download data for automatically imported years',
  exec: async () => {
    const years = await db<YearRecord>('app.years').whereNotNull('importUrl');
    for (const year of years) {
      try {
        if (!year.importPeriodMinutes || !year.importUrl) continue;
        const lastImport = await db<ImportRecord>('app.imports')
          .first()
          .where('profileId', '=', year.profileId)
          .where('year', '=', year.year)
          .orderBy('created', 'desc');
        if (
          !lastImport ||
          lastImport.created <
            new Date(Date.now() - 1000 * 60 * year.importPeriodMinutes)
        ) {
          const importDir = await Import.createImportDir();
          await axios
            .get(year.importUrl, {responseType: 'stream'})
            .then(async r => {
              const dataPath = path.join(importDir, 'data.zip');
              const dataFileStream = fs.createWriteStream(dataPath);
              r.data.pipe(dataFileStream);
              dataFileStream.on('finish', async () => {
                // TODO: Assuming each imported year has to be unzipped for now
                await extract(dataPath, {dir: importDir});
                dataFileStream.close();
              });
            });
          const importData: Partial<ImportRecord> = {
            profileId: year.profileId,
            year: year.year,

            created: DateTime.local().toJSDate(),
            status: 'pending',
            error: undefined,
            append: false,
            importDir,
            format: year.importFormat,
          };
          await db<ImportRecord>('app.imports').insert(importData);
          console.log(`Downloaded ${year.importUrl}`);
        }
      } catch (err) {
        console.error(`Downloading ${year.importUrl} failed: ${err.message}`);
      }
    }
  },
};
