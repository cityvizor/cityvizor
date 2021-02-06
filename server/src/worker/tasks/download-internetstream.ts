import {ProfileRecord} from '../../schema';
import {CronTask} from '../../schema/cron';
import {db} from '../../db';
import axios from 'axios';
import * as fs from 'fs-extra';
import path from 'path';
import * as yauzl from 'yauzl';

export const InternetStream: CronTask = {
    id: 'internet-stream',
    name: 'Download data from Cernosice, Nmnm, Ub',
    exec: async () => {
      internetStreamConfig.forEach(async s => {
        if (profileIdPresent(s.shortcut)) {
          const profileId = await getProfileId(s.shortcut);
          s.definitions.forEach(d => {
            processFiles(s.url + d.fileName, profileId, d.year);
          });
        }
      });
    },
  };

async function processFiles(url: string, profileId: number, year: number) {
await axios.get(url, {responseType: 'stream'}).then(r => {
    const tmpZippedData = fs.createWriteStream(
    path.join(config.storage.tmpInternetStream, 'tmp_zipped_data')
    );
    r.data.pipe(tmpZippedData);
    tmpZippedData.on('finish', () => {
    tmpZippedData.close();
    unzipFile(profileId, year);
    });
});
}
async function unzipFile(profileId: number, year: number) {
    yauzl.open(
      path.join(config.storage.tmpInternetStream, 'tmp_zipped_data'),
      {lazyEntries: true},
      (error, zipfile) => {
        if (error) throw error;
        zipfile.readEntry();
        zipfile.on('entry', entry => {
          if (/\/$/.test(entry.fileName)) {
            zipfile.readEntry();
          } else {
            zipfile.openReadStream(entry, (err, readStream) => {
              if (err) throw err;
              readStream.on('end', () => {
                zipfile.readEntry();
              });
              const tmpUnzippedData = fs.createWriteStream(
                path.join(config.storage.tmpInternetStream, entry.fileName)
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