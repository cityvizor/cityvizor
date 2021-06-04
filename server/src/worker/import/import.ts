/* eslint-disable @typescript-eslint/no-namespace */
/* tslint:disable:no-namespace max-classes-per-file */
// remove when import of ZIP sorted out
import {
  AccountingRecord,
  EventRecord,
  PaymentRecord,
  YearRecord,
} from '../../schema';
import {Transaction} from 'knex';
import crypto from 'crypto';
import * as fs from 'fs-extra';
import path from 'path';
import config from '../../config';

export namespace Import {
  export async function createImportDir(): Promise<string> {
    const randomName =
      new Date().toISOString() + crypto.randomBytes(32).toString('hex');
    const fullPath = path.join(config.storage.imports, randomName);
    await fs.ensureDir(fullPath);
    return fullPath;
  }
  export type Format =
    | 'cityvizor'
    | 'internetstream'
    | 'pbo_expected_plan'
    | 'pbo_real_plan'
    | 'pbo_aa_names';
  export interface Options {
    profileId: YearRecord['profileId'];
    year: YearRecord['year'];
    transaction: Transaction;
    importDir: string;
    append: boolean;
    fileName?: string;
    format: Format;
  }

  export type ImportChunk = PaymentChunk | EventChunk | AccountingChunk;

  export class PaymentChunk {
    type!: 'payment';
    record!: PaymentRecord;
  }

  export class EventChunk {
    type!: 'event';
    record!: EventRecord;
  }

  export class AccountingChunk {
    type!: 'accounting';
    record!: AccountingRecord;
  }
}
