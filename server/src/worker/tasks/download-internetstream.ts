import {ProfileRecord} from '../../schema';
import {ImportRecord} from '../../schema/database/import';
import {CronTask} from '../../schema/cron';
import {db} from '../../db';
import axios from 'axios';
import * as fs from 'fs-extra';
import path from 'path';
import * as yauzl from 'yauzl';
import config from '../../config';
import crypto from 'crypto';
import {DateTime} from 'luxon';

export const InternetStream: CronTask = {
  id: 'internet-stream',
  name: 'Download data from Cernosice, Nmnm, Ub',
  exec: async () => {
    for (const s of internetStreamConfig) {
      if (await profileIdPresent(s.shortcut)) {
        const profileId = await getProfileId(s.shortcut);
        s.definitions.forEach(d => {
          processFiles(s.url + d.fileName, profileId, d.year);
        });
      }
    }
  },
};

async function processFiles(url: string, profileId: number, year: number) {
  const dirName = crypto.randomBytes(64).toString('hex');
  await axios.get(url, {responseType: 'stream'}).then(async r => {
    const zipPath = path.join(
      path.join(config.storage.imports, dirName),
      'data.zip'
    );
    await fs.ensureDir(zipPath);
    const tmpZippedData = fs.createWriteStream(zipPath);
    r.data.pipe(tmpZippedData);
    tmpZippedData.on('finish', async () => {
      tmpZippedData.close();
      await unzipFile(zipPath);
    });
  });
  const importData: Partial<ImportRecord> = {
    profileId,
    year,

    created: DateTime.local().toJSDate(),
    status: 'pending',
    error: undefined,
    append: false,
    dirName,
    format: 'internetstream',
  };
  await db<ImportRecord>('app.imports').insert(importData);
}

async function unzipFile(dir: string) {
  yauzl.open(
    path.join(dir, 'data.zip'),
    {lazyEntries: true},
    (error, zipfile) => {
      if (error) throw error;
      if (!zipfile) return;
      zipfile.readEntry();
      zipfile.on('entry', entry => {
        if (/\/$/.test(entry.fileName)) {
          zipfile.readEntry();
        } else {
          zipfile.openReadStream(entry, (err, readStream) => {
            if (err) throw err;
            if (!readStream) return;
            readStream.on('end', () => {
              zipfile.readEntry();
            });
            const tmpUnzippedData = fs.createWriteStream(
              path.join(dir, entry.fileName)
            );
            readStream.pipe(tmpUnzippedData);
            tmpUnzippedData.on('finish', () => {
              tmpUnzippedData.close();
            });
          });
        }
      });
    }
  );
}

async function profileIdPresent(cityShortcut: string): Promise<boolean> {
  const record = await db<ProfileRecord>('app.profiles').where({
    url: cityShortcut,
  });
  return record.length !== 0;
}

async function getProfileId(cityShortcut: string): Promise<number> {
  const record = await db<ProfileRecord>('app.profiles').where({
    url: cityShortcut,
  });
  return record[0].id;
}

const internetStreamConfig = [
  {
    shortcut: 'cernosice',
    url: 'http://rozpocet.mestocernosice.cz/opendata/',
    definitions: [
      {
        year: 2020,
        fileName: 'opendata_2020_CSV.zip',
      },
    ],
  },
  {
    shortcut: 'ub',
    url: 'http://rozpocet.ub.cz/opendata/',
    definitions: [
      {
        year: 2020,
        fileName: 'opendata_2020_CSV.zip',
      },
    ],
  },
  {
    shortcut: 'nmnm',
    url: 'http://rozpocet.nmnm.cz/opendata/',
    definitions: [
      {
        year: 2020,
        fileName: 'opendata_2020_CSV.zip',
      },
    ],
  },
];
