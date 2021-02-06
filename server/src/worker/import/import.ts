/* eslint-disable @typescript-eslint/no-namespace */
/* tslint:disable:no-namespace max-classes-per-file */
// remove when import of ZIP sorted out
import {
  AccountingRecord,
  EventRecord,
  PaymentRecord,
  YearRecord,
} from '../../schema';
import {Transaction} from "knex"

export namespace Import {
  
  export interface Options {
    profileId: YearRecord['profileId'];
    year: YearRecord['year'];
    transaction: Transaction;
    importDir: string;
    append: boolean;
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
