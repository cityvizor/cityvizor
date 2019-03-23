import { KxxRecord, KxxRecordBalance, kxxreader } from "kxx-reader-browser";
import { ImportedData, ImportedRecord, ImportedPayment, ImportedEvent } from "app/shared/schema";

import * as Papa from "papaparse";
import { Importer } from "../schema/importer";

export class ImporterGinis implements Importer {

  payments: ImportedPayment[] = [];
  records: ImportedRecord[] = [];
  events: ImportedEvent[] = [];
  recordIndex: { [key: string]: ImportedRecord } = {};

  bytesTotal: number = Infinity;
  bytesRead: number = 0;

  paymentTypes = {
    "KOF": "invoice_outgoing",
    "KDF": "invoice_incoming",
    "UCT": "accounting_document"
  };

  constructor() { }

  async import(files: { budget?: File, accounting?: File, events?: File }) {

    this.bytesTotal = (files.budget ? files.budget.size : 0) + (files.accounting ? files.accounting.size : 0) + (files.events ? files.events.size : 0);

    this.updateProgress(0);

    if (files.budget) await this.parseAccounting(files.budget);

    if (files.accounting) await this.parseAccounting(files.accounting);

    if (files.events) await this.parseEvents(files.events);

    this.updateProgress(this.bytesTotal);

    return this.getData();
  }

  updateProgress(bytesRead: number) {
    this.bytesRead = bytesRead;
    postMessage({ type: "progress", data: bytesRead / this.bytesTotal })
  }

  parseAccounting(file: File) {
    return this.getFileReadable(file, "windows-1250")
      .pipeThrough(kxxreader())
      .pipeTo(this.getWritable());
  }


  parseEvents(file: File) {

    const bytesReadInitial = this.bytesRead;

    return new Promise((resolve, reject) => {

      Papa.parse(file, {
        header: true,

        encoding: "windows-1250",

        chunk: (result, parser) => {
          
          this.updateProgress(this.bytesRead + result.meta.cursor);

          result.data.forEach(row => {
            if (row["ORG"] && row["NAZEV"]) {
              this.events.push({
                srcId: Number(row["ORG"].replace(".", "")),
                name: row["NAZEV"]
              })
            }
          });
        },

        complete: (results, file) => resolve(),
        error: (err, file) => reject(err)
      });

    });
  }


  getFileReadable(file: File, encoding: string): ReadableStream<string> {

    const td = new TextDecoder(encoding);
    const transformer: Transformer<Uint8Array, string> = {

      start: (controller) => { },

      transform: (chunk, controller) => {

        this.updateProgress(this.bytesRead + chunk.byteLength);

        controller.enqueue(td.decode(chunk));
      },

      flush: (controller) => { }
    };

    const td_transform = new TransformStream<Uint8Array, string>(transformer);

    return new Response(file).body.pipeThrough(td_transform)

  }

  getWritable() {

    return new WritableStream({

      // Implement the sink
      write: async (record: KxxRecord) => this.writeRecord(record),

      close: () => { },

      abort: (err) => console.log("Sink error:", err)

    }, new CountQueuingStrategy({ highWaterMark: 1000 }));

  }

  getData(): ImportedData {
    return {
      payments: this.payments,
      records: this.records,
      events: this.events
    }
  }

  writeRecord(record: KxxRecord) {

    const payment = record.meta["EVK"] && (record.meta["EVK"]["KDF"] || record.meta["EVK"]["KOF"] /*|| record.meta["EVK"]["UCT"]*/);

    this.filterBalances(record.balances)
      .forEach(balance => {
        this.writeBalance(record.type, balance)
        if (payment) this.writePayment(balance, record);
      });

  }

  filterBalances(balances: KxxRecordBalance[]) {
    return balances
      .filter(balance => balance.pol > 1000 && balance.pol < 9000 && balance.odpa !== 6330);
  }

  getAmount(balance: KxxRecordBalance): number {
    return Number(balance.pol) < 5000 ? balance.md - balance.d : balance.d - balance.md;
  }

  writeBalance(balanceType: number, balance: KxxRecordBalance) {
    const id = [balance.odpa, balance.pol, balance.org].join("-");

    var record = this.recordIndex[id];

    if (!record) {
      record = {
        paragraph: balance.odpa,
        item: balance.pol,
        event: balance.org || null,
        budgetAmount: 0,
        amount: 0
      };
      this.records.push(record);
      this.recordIndex[id] = record;
    }

    const amount = this.getAmount(balance);

    switch (balanceType) {
      case 0:
        this.recordIndex[id].amount += amount;
        break;
      case 2:
        this.recordIndex[id].budgetAmount += amount;
        break;
    }
  }

  writePayment(balance: KxxRecordBalance, record: KxxRecord) {
    this.payments.push({
      date: record.date,
      type: Object.entries(this.paymentTypes).find(entry => !!record.meta["EVK"][entry[0]])[1],
      id: record.meta["EVK"]["KDF"] || record.meta["EVK"]["KOF"],
      counterparty_id: record.meta["IC"],
      counterparty_name: record.meta["DICT"],
      amount: this.getAmount(balance),
      comment: record.meta["EVKT"] || record.comments.join("\n").split(/\r?\n/)[0],
      paragraph: balance.odpa,
      item: balance.pol,
      event: balance.org || null
    })
  }
}