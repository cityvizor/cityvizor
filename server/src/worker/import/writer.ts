import { db } from "../../db";
import { AccountingRecord, PaymentRecord, EventRecord, ProfileRecord, YearRecord } from "../../schema/database";
import { Writable } from "stream";

export class ImportWriter extends Writable {

  c = 0;

  constructor(private options: ImportWriter.Options) {
    super({
      objectMode: true
    });
  }

  async clear() {

    var tasks = [
      db("data.accounting").where({ profileId: this.options.profileId, year: this.options.year }).delete(),
      db("data.payments").where({ profileId: this.options.profileId, year: this.options.year }).delete(),
      db("data.events").where({ profileId: this.options.profileId, year: this.options.year }).delete()
    ];

    await Promise.all(tasks);
  }

  _write(chunk: ImportWriter.Chunk, encoding: string, callback: (err: Error) => void) {
    return this._writev([{ chunk, encoding }], callback);
  }

  async _writev(chunks: { chunk: ImportWriter.Chunk, encoding: string }[], callback: (err?: Error) => void) {

    const balances = chunks.filter(chunk => chunk.chunk.type === "balance").map(chunk => this.prepareBalance(chunk.chunk.data));
    const payments = chunks.filter(chunk => chunk.chunk.type === "payment").map(chunk => this.preparePayment(chunk.chunk.data));
    const events = chunks.filter(chunk => chunk.chunk.type === "event").map(chunk => this.prepareEvent(chunk.chunk.data));

    try {
      if (balances.length) await this.writeBalances(balances);
      if (payments.length) await this.writePayments(payments);
      if (events.length) await this.writeEvents(events);

      callback();
    }
    catch (err) {
      callback(err);
    }

  }

  prepareBalance(balance: Partial<AccountingRecord>): AccountingRecord {
    return {
      "profileId": this.options.profileId,
      "year": this.options.year,
      "type": balance.type ? String(balance.type) : null,
      "paragraph": balance.paragraph ? Number(balance.paragraph) : null,
      "item": balance.item ? Number(balance.item) : null,
      "unit": balance.unit ? Number(balance.unit) : null,
      "event": balance.event ? Number(balance.event) : null,
      "amount": balance.amount ? Number(balance.amount) : null
    };
  }

  preparePayment(payment: Partial<PaymentRecord>): PaymentRecord {
    return {
      "profileId": this.options.profileId,
      "year": this.options.year,
      "paragraph": payment.paragraph ? Number(payment.paragraph) : null,
      "item": payment.item ? Number(payment.item) : null,
      "unit": payment.unit ? Number(payment.unit) : null,
      "event": payment.event ? Number(payment.event) : null,
      "amount": payment.amount ? Number(payment.amount) : null,
      "date": payment.date ? String(payment.date) : null,
      "counterpartyId": payment.counterpartyId ? String(payment.counterpartyId) : null,
      "counterpartyName": payment.counterpartyName ? String(payment.counterpartyName) : null,
      "description": payment.description ? String(payment.description) : null,
    }
  }

  prepareEvent(event: Partial<EventRecord>): EventRecord {
    return {
      "profileId": this.options.profileId,
      "year": this.options.year,
      "id": event["id"] ? Number(event["id"]) : null,
      "name": event["name"] ? String(event["name"]) : null
    }
  }

  async writeBalances(balances: AccountingRecord[]) {
    return db<AccountingRecord>("data.accounting").insert(balances);
  }

  async writePayments(payments: PaymentRecord[]) {
    return db<PaymentRecord>("data.payments").insert(payments);
  }

  async writeEvents(events: EventRecord[]) {
    return db<EventRecord>("data.events").insert(events);
  }

}

export namespace ImportWriter {

  export interface Options {
    profileId: YearRecord["profileId"]
    year: YearRecord["year"]
  };

  export type Chunk = { type: "balance", data: Partial<AccountingRecord> } | { type: "event", data: Partial<EventRecord> } | { type: "payment", data: Partial<PaymentRecord> };
}