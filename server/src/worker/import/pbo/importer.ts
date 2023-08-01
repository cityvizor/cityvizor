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
  const file = dirFiles.find(filename => filename.match(/.*.csv/));
  if (!file) {
    throw Error('Csv file to import not found');
  }

  if (!options.append) {
    await options
      .transaction(
        options.format === 'pbo_expected_plan'
          ? 'data.pbo_expected_plans'
          : options.format === 'pbo_real_plan'
          ? 'data.pbo_real_plans'
          : 'data.pbo_aa_names'
      )
      .where({profileId: options.profileId, year: options.year})
      .delete();
  }
  logger.log('Deleted previous plan from the DB');

  const planFilePath = path.join(options.importDir, file);

  const fileReader = fs.createReadStream(planFilePath);
  const csvParser = createCsvParser(options);
  const pboParser = createPboParser(options);
  const dbWriter = new DatabaseWriter(options);

  await promisify(pipeline)(fileReader, csvParser, pboParser, dbWriter);
}
