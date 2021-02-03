import {db} from '../../db';
import {
  AccountingRecord,
  EventRecord,
  PaymentRecord,
  YearRecord,
} from '../../schema';
import {Writable} from 'stream';
import logger from './logger';
import {Importer} from './importer';
import {Transaction} from 'knex';

export class ImportWriter extends Writable {
  accountingCount = 0;
  paymentCount = 0;
  eventCount = 0;

  constructor(private options: Options) {
    super({
      objectMode: true,
    });
  }

  async _write(
    chunk: Importer.ImportChunk,
    encoding: string,
    callback: (err?: Error) => void
  ) {
    await this._writev([{chunk, encoding}], callback);
  }

  async _writev(
    chunks: {chunk: Importer.ImportChunk; encoding: string}[],
    callback: (err?: Error) => void
  ) {
    const accountings = chunks
      .filter(chunk => chunk.chunk.type === 'accounting')
      .map(chunk => chunk.chunk.record as AccountingRecord);
    const payments = chunks
      .filter(chunk => chunk.chunk.type === 'payment')
      .map(chunk => chunk.chunk.record as PaymentRecord);
    const events = chunks
      .filter(chunk => chunk.chunk.type === 'event')
      .map(chunk => chunk.chunk.record as EventRecord);
    try {
      if (accountings.length) {
        await this.writeAccountings(accountings);
        this.accountingCount += accountings.length;
      }
      if (payments.length) {
        await this.writePayments(payments);
        this.paymentCount += payments.length;
      }
      if (events.length) {
        await this.writeEvents(events);
        this.eventCount += events.length;
      }
      callback();
    } catch (err) {
      callback(err);
    }
  }

  _final(callback) {
    [
      [this.accountingCount, 'accounting'],
      [this.paymentCount, 'payment'],
      [this.eventCount, 'event'],
    ].forEach(([v, name]) => {
      if (v > 0) logger.log(`Written ${v} ${name} records to the DB.`);
    });
    callback();
  }

  async writeAccountings(accountings: AccountingRecord[]) {
    await db<AccountingRecord>('data.accounting')
      .insert(accountings)
      .transacting(this.options.transaction);
  }

  async writePayments(payments: PaymentRecord[]) {
    await db<PaymentRecord>('data.payments')
      .insert(payments)
      .transacting(this.options.transaction);
  }

  async writeEvents(events: EventRecord[]) {
    await db<EventRecord>('data.events')
      .insert(events)
      .transacting(this.options.transaction);
  }
}

export interface Options {
  profileId: YearRecord['profileId'];
  year: YearRecord['year'];
  transaction: Transaction;
}
