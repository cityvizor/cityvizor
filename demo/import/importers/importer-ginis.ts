import { KxxRecord, KxxRecordBalance, kxxreader } from "kxx-reader-browser";
import { ImportedData, ImportedRecord, ImportedPayment, ImportedEvent } from "app/shared/schema";
import { FileSource } from "../tools/file-source";

declare var self: WindowOrWorkerGlobalScope & { streamsPolyfill: boolean };

import * as Papa from "papaparse";
import { Importer } from "../schema/importer";
import { rejects } from "node:assert";

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

  constructor() {
  }

  // Throws an exception if validation fails
  static async validate(files: { budget?: File, accounting?: File, events?: File }) {
    const promises: Promise<void>[] = []
    if (files.budget) promises.push(this.validateAccounting(files.budget))
    if (files.accounting) promises.push(this.validateAccounting(files.accounting))
    if (files.events) promises.push(this.validateEvents(files.events))
    return Promise.all(promises)
   
  }

 // Because the parsing is done in a completely separate module, the validating is done here
  static async validateAccounting(file: File): Promise<void> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        const regexes = [
          /^[56G]\/[\$@#].*$/
        ];
        
        const lines = (reader.result as string).split("\n").filter(line => line)
        let rejected = false
        for (let line of lines) {
          line = line.trim()
          if (!regexes.some((r: RegExp) => r.test(line))) {
            reject(`Datový soubor obsahuje řádku v neočekávaném formátu: ${line}\n Je možné, že i jiné řádky jsou v neočekávaném formátu.`)
            rejected = true
            break
          }
        };
        if (!rejected) resolve();
      }
      reader.readAsText(file, "windows-1250");
    })
  }

static async validateEvents(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      delimiter: ";",
      quoteChar: "@$^&*(",
      encoding: "windows-1250",

      complete: (results, file) => {
        const mandatoryHeaders = ["ORG", "NAZEV", "SU"];
        if (!mandatoryHeaders.some(field => results.meta.fields?.includes(field))) {
          reject(`Číselník neobsahuje sloupce ${mandatoryHeaders.join(",")}`)
        }
        resolve()
      },
      error: (err, file) => reject(err)
    });

  }) 
} 
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
    postMessage({ type: "progress", data: bytesRead / this.bytesTotal }, null)
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

        delimiter: ";",

        quoteChar: "@$^&*(",

        encoding: "windows-1250",

        chunk: (result, parser) => {

          this.updateProgress(this.bytesRead + result.meta.cursor);

          result.data.forEach(row => {
            if (row["ORG"] && row["NAZEV"] && row["SU"]) {
              this.events.push({
                syntheticAccount: Number(row["SU"].replace(".", "")),
                srcId: Number(row["ORG"].replace(".", "")),
                name: row["NAZEV"] !== "." ? row["NAZEV"] : null
              })
            }
          });
        },

        complete: (results, file) => resolve(results),
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

    var fileReadable: ReadableStream;

    if (self.streamsPolyfill) {
      /* This could be done by new Response(file).body, but conflicts with polyfill */
      /* More here: https://github.com/creatorrr/web-streams-polyfill/issues/10 */
      console.log("Compatibility: Using FileReader API for reading source files");
      const fileSource = new FileSource(file);
      fileReadable = new ReadableStream(fileSource);
    }
    else {
      fileReadable = new Response(file).body;
    }

    return fileReadable.pipeThrough(td_transform);

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
      .filter(balance => balance.pol > 1000 && balance.pol < 9000); // omezeni na rozpoctovou skladbu - zbytek jsou technicke      
  }

  getAmount(balance: KxxRecordBalance): number {
    return (Number(balance.pol) >= 5000 && Number(balance.pol) < 8000) ? balance.d - balance.md : balance.md - balance.d;
  }

  writeBalance(balanceType: number, balance: KxxRecordBalance) {
    const id = [balance.odpa, balance.pol, balance.org, balance.orj].join("-");

    var record = this.recordIndex[id];

    if (!record) {
      record = {
        paragraph: balance.odpa,
        item: balance.pol,
        event: balance.org || null,
        unit: balance.orj,
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

      case 2: // approved budget
      case 3: // edited budget
        this.recordIndex[id].budgetAmount += amount;
        break;
    }
  }

  writePayment(balance: KxxRecordBalance, record: KxxRecord) {
    this.payments.push({
      date: record.date,
      type: Object.entries(this.paymentTypes).find(entry => !!record.meta["EVK"][entry[0]])[1],
      id: record.meta["EVK"]["KDF"] || record.meta["EVK"]["KOF"],
      counterpartyId: record.meta["IC"],
      counterpartyName: record.meta["DICT"],
      amount: this.getAmount(balance),
      description: record.meta["EVKT"] || record.comments.join("\n").split(/\r?\n/)[0],
      paragraph: balance.odpa,
      item: balance.pol,
      event: balance.org || null,
      unit: balance.orj || null
    })
  }
}