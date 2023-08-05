import {db} from '../../db';
import {AccountingRecord, PaymentRecord, EventRecord} from '../../schema';
import {Writable} from 'stream';
import logger from './logger';
import {Import} from './import';

export class DatabaseWriter extends Writable {
  accountingCount = 0;
  paymentCount = 0;
  eventCount = 0;

  constructor(private options: Import.Options) {
    super({
      objectMode: true,
    });
  }

  async _writev(
    chunks: {chunk: Import.ImportChunk; encoding: string}[],
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
      if (err instanceof Error) {
        callback(err);
      }
    }
  }

  _final(callback) {
    [
      [this.accountingCount, 'accounting'],
      [this.paymentCount, 'payment'],
      [this.eventCount, 'event'],
    ].forEach(([count, name]) => {
      const countNum = Number(count);
      if (countNum > 0) {
        logger.log(`Written ${countNum} ${name} records to the DB.`);
      }
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
