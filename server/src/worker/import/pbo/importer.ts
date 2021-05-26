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
  const planFile = dirFiles.find(file => file.match(/.?Plan.csv/));
  if (!planFile) {
    throw Error('*Plan.csv file not found');
  }

  if (!options.append) {
    await options
      .transaction(
        options.format === 'pbo_expected_plan'
          ? 'data.pbo_expected_plans'
          : 'data.pbo_real_plans'
      )
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
