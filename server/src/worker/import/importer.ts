// remove when import of ZIP sorted out
import {ImportParser} from './parser';
import {ImportWriter} from './writer';
import {
  AccountingRecord,
  EventRecord,
  PaymentRecord,
  YearRecord,
} from '../../schema';
import {pipeline} from 'stream';
import {promisify} from 'util';
import fs from 'fs-extra';
import {Transaction} from 'knex';

export class Importer {
  constructor(private options: Importer.Options) {
    if (!options.profileId) throw new Error('Missing profileId');
    if (!options.year) throw new Error('Missing year');
  }

  async import(files: Importer.OptionsFiles) {
    // Check which files have to be imported
    for (const [file, path] of Object.entries(files)) {
      if (path) {
        const fileReader = fs.createReadStream(path);
        const csvParser = ImportParser.createCsvParser(file);
        const csvTransformer = ImportParser.createCsvTransformer(
          file,
          this.options
        );
        const DbWriter = new ImportWriter(this.options);
        // The pipeline construct ensures every stream obtains the close signals
        // TODO: Remove the promisify workaround after upgrade to Node 15.x that has awaitable pipelines by default
        await promisify(pipeline)(
          fileReader,
          csvParser,
          csvTransformer,
          DbWriter
        );
      }
    }
  }
}

export namespace Importer {
  export interface OptionsFiles {
    dataFile?: string;
    eventsFile?: string;
    paymentsFile?: string;
    accountingFile?: string;
  }

  export interface Options {
    profileId: YearRecord['profileId'];
    year: YearRecord['year'];
    transaction: Transaction;
  }

  export type ImportChunk = PaymentChunk | EventChunk | AccountingChunk;

  export class PaymentChunk {
    type: 'payment';
    record: PaymentRecord;
  }

  export class EventChunk {
    type: 'event';
    record: EventRecord;
  }

  export class AccountingChunk {
    type: 'accounting';
    record: AccountingRecord;
  }
}
