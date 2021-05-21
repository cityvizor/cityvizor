import {Import} from '../import';
import fs from 'fs-extra';
import path from 'path';
import logger from '../logger';
import {createCsvParser, createPboParser} from './parser';
import {DatabaseWriter} from './writer';
import {promisify} from 'util';
import {pipeline} from 'stream';

export async function importPbo(options: Import.Options) {
  const dirFiles = await fs.readdir(options.importDir);
  const planFile = dirFiles.find(file => file === 'plan.csv');
  if (!planFile) {
    throw Error('plan.csv file not found');
  }

  if (!options.append) {
    await options
      .transaction('data.pbo_plans')
      .where({profileId: options.profileId, year: options.year})
      .delete();
  }
  logger.log('Deleted previous plan from the DB');

  const planFilePath = path.join(options.importDir, planFile);

  const fileReader = fs.createReadStream(planFilePath);
  const csvParser = createCsvParser();
  const pboParser = createPboParser(options);
  const dbWriter = new DatabaseWriter(options);

  await promisify(pipeline)(fileReader, csvParser, pboParser, dbWriter);
}
