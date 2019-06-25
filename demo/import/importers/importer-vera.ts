import { KxxRecord, KxxRecordBalance, kxxreader } from "kxx-reader-browser";
import { ImportedData, ImportedRecord, ImportedPayment, ImportedEvent } from "app/shared/schema";
import { FileSource } from "../tools/file-source";

declare var self: WorkerGlobalScope & { streamsPolyfill: boolean };

import * as Papa from "papaparse";
import { Importer } from "../schema/importer";

export class ImporterVera implements Importer {

  payments: ImportedPayment[] = [];
  records: ImportedRecord[] = [];
  events: ImportedEvent[] = [];
  recordIndex: { [key: string]: ImportedRecord } = {};

  bytesTotal: number = Infinity;
  bytesRead: number = 0;

  paymentTypes = {    
    "PV": "invoice_incoming"
  };

  accountingHeader = ["ucetni_doklad","agenda","doklad","mesic","rok","datum","su","au","odpa","pol","zj","n","z","uz","orj","org","a","tz","ico_part","ico_trans","md","d","poznamka","cis_rada","obsah_dokladu","variabilni_symbol","ico_partnera","subjekt","duzp","dud","mes_dph","rok_dph","zauctoval","datum_zauctovani"];
  accountingHeaderI = 0;

  constructor() {
  }

  async import(files: { accounting?: File, budget?: File }) {

    this.bytesTotal = (files.budget ? files.budget.size : 0) + (files.accounting ? files.accounting.size : 0);

    this.updateProgress(0);

    if (files.accounting) await this.parseAccounting(files.accounting);

    if (files.budget) await this.parseBudget(files.budget);

    this.updateProgress(this.bytesTotal);

    return this.getData();
  }

  updateProgress(bytesRead: number) {
    this.bytesRead = bytesRead;
    postMessage({ type: "progress", data: bytesRead / this.bytesTotal })
  }

  parseAccounting(file: File) {

    const bytesReadInitial = this.bytesRead;
    this.accountingHeaderI = 0;
    
    return new Promise((resolve, reject) => {

      Papa.parse(<any>file, <any>{
        header: true,

        delimiter: ";",

        transformHeader: () => {
          this.accountingHeaderI++;
          return this.accountingHeader[this.accountingHeaderI - 1];
        },

        quoteChar: "@$^&*(", // ignore quotes

        encoding: "windows-1250",

        chunk: (result, parser) => {

          console.log(result);
          
          this.updateProgress(this.bytesRead + result.meta.cursor);

          result.data.forEach(row => {
            this.writeRecord(row);
          });
        },

        complete: (results, file) => resolve(),
        error: (err, file) => reject(err)
      });

    });
  }


  parseBudget(file: File) {
    return this.getFileReadable(file, "windows-1250")
      .pipeThrough(kxxreader())
      .pipeTo(this.getBudgetWriter());
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

  getBudgetWriter() {

    return new WritableStream({

      // Implement the sink
      write: async (kxxRecord: KxxRecord) => {

        this.filterBalances(kxxRecord.balances)
          .forEach(balance => {
            this.writeBalance(3, balance);
          });

      },

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