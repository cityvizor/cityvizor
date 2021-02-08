import axios from 'axios';
import csvparse from 'csv-parse';
import {ProfileRecord} from '../../schema';
import {CronTask} from '../../schema/cron';
import {InternetStreamConfig} from './internet-stream-config';
import {db} from '../../db';
import * as fs from 'fs-extra';
import * as yauzl from 'yauzl';
import config from '../../config';
import path from 'path';
import {ImportParser} from '../import/parser';
import {pipeline, Transform} from 'stream';
import {Importer} from '../import/importer';
import {promisify} from 'util';
import {ImportWriter} from '../import/writer';

export const InternetStream: CronTask = {
  id: 'internet-stream',
  name: 'Download data from Cernosice, Nmnm, Ub',
  exec: async () => {
    InternetStreamConfig.source.forEach(async s => {
      if (profileIdPresent(s.shortcut)) {
        const profileId = await getProfileId(s.shortcut);
        s.definitions.forEach(d => {
          processFiles(s.url + d.fileName, profileId, d.year);
        });
      }
    });
  },
};

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
              save(profileId, year);
            });
          });
        }
      });
    }
  );
}

const internetStreamHeaders = [
  'DOKLAD_ROK',
  'DOKLAD_DATUM',
  'DOKLAD_AGENDA',
  'DOKLAD_CISLO',
  'ORGANIZACE',
  'ORGANIZACE_NAZEV',
  'ORJ',
  'ORJ_NAZEV',
  'PARAGRAF',
  'PARAGRAF_NAZEV',
  'POLOZKA',
  'POLOZKA_NAZEV',
  'SUBJEKT_IC',
  'SUBJEKT_NAZEV',
  'CASTKA_MD',
  'CASTKA_DAL',
  'POZNAMKA',
];

function parseHeader(headerLine: string[], headerNames: string[]): string[] {
  const foundHeaders: string[] = [];
  headerLine.forEach(h => {
    if (headerNames.includes(h)) {
      foundHeaders.push(h);
    }
  });
  return foundHeaders;
}

function createParser() {
  return csvparse({
    delimiter: ';',
    columns: line => parseHeader(line, internetStreamHeaders),
    relax_column_count: true,
  });
}

function createTransformer(options: Importer.Options) {
  return new Transform({
    writableObjectMode: true,
    readableObjectMode: true,
    transform(line, enc, callback) {
      const recordType = line.DOKLAD_AGENDA;
      const itemPolozka = line.POLOZKA;
      const amountMd = line.CASTKA_MD;
      const amountDal = line.CASTKA_DAL;
      const amountFinal =
        itemPolozka < 5000 ? amountMd - amountDal : amountDal - amountMd;
      const cityVizorLine = {
        type: recordType,
        paragraph: line.PARAGRAF,
        item: itemPolozka,
        event: line.ORGANIZACE,
        amount: amountFinal,
        date: line.DOKLAD_DATUM,
        counterpartyId: line.SUBJEKT_IC,
        counterpartyName: line.SUBJEKT_NAZEV,
        description: line.POZNAMKA,
        unit: line.ORJ,
      };

      if (recordType === 'KDF' || recordType === 'KOF') {
        try {
          const payment = ImportParser.createPaymentRecord(
            cityVizorLine,
            options
          );
          this.push({type: 'payment', record: payment});
          callback();
        } catch (err) {
          callback(err);
        }
      } else {
        const accounting = ImportParser.createAccountingRecord(
          cityVizorLine,
          options
        );
        this.push({type: 'accounting', record: accounting});
        callback();
      }
    },
  });
}

async function save(id: number, idYear: number) {
  let error: Error | null = null;
  const trx = await db.transaction();
  try {
    const options = {
      profileId: id,
      year: idYear,
      transaction: trx,
    };
    await importFiles(options);
  } catch (err) {
    error = err;
  } finally {
    if (error) {
      trx.rollback();
    } else {
      trx.commit();
    }
    // TODO cleanup await fs.remove(config.storage.tmpInternetStream);
  }
}

async function importFiles(options: Importer.Options) {
  const csvPaths = [
    path.join(config.storage.tmpInternetStream, 'RU.csv'),
    path.join(config.storage.tmpInternetStream, 'SK.csv'),
  ];
  for (const p of csvPaths) {
    const fileReader = fs.createReadStream(p);
    const csvParser = createParser();
    const csvTransformer = createTransformer(options);
    const DbWriter = new ImportWriter(options);
    // The pipeline construct ensures every stream obtains the close signals
    // TODO: Remove the promisify workaround after upgrade to Node 15.x that has awaitable pipelines by default
    await promisify(pipeline)(fileReader, csvParser, csvTransformer, DbWriter);
  }
}
