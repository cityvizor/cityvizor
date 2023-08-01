import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as iconv from "iconv-lite";

import { AccountingData, ImportedData, AccountingPayment, AccountingRecord, ImportedPayment, ImportedRecord, AccountingEvent, ImportedEvent } from 'app/shared/schema';
import { Buffer } from 'buffer';

interface ExportOptions {
  encoding: string;
  delimiter: string;
  newline: string;
  header?: { [key: string]: string };
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  async exportRecords(records: (ImportedRecord | AccountingRecord)[], options: ExportOptions) {
    await this.downloadFile(this.createCSV(records, options), "records.csv", options.encoding);
  }
  async exportPayments(payments: (ImportedPayment | AccountingPayment)[], options: ExportOptions) {
    await this.downloadFile(this.createCSV(payments, options), "payments.csv", options.encoding);
  }
  async exportEvents(events: (ImportedEvent | AccountingEvent)[], options: ExportOptions) {
    await this.downloadFile(this.createCSV(events, options), "events.csv", options.encoding);
  }
  async exportCityVizorData(data: ImportedData | AccountingData) {
    const records = [];
    (<(ImportedRecord | AccountingRecord)[]>data.records).forEach(record => {
      records.push({
        type: "ROZ",
        paragraph: record.paragraph,
        item: record.item,
        event: record.event,
        unit: record.unit,
        amount: record.budgetAmount
      });
      records.push({
        // HACK, this field has to be non-empty, otherwise Cityvizor won't parse it as a payment 
        type: "POK",
        paragraph: record.paragraph,
        item: record.item,
        event: record.event,
        unit: record.unit,
        amount: record.amount
      });
    });

    // the payment
    records.push(...(<(ImportedPayment | AccountingPayment)[]>data.payments).map(payment => ({
      type: payment.type === "invoice_incoming" ? "KDF" : "KOF",
      id: payment.id,
      paragraph: payment.paragraph,
      item: payment.item,
      event: payment.event,
      unit: payment.unit,
      amount: payment.amount,
      date: payment.date,
      counterpartyId: payment.counterpartyId,
      counterpartyName: payment.counterpartyName,
      description: payment.description
    })));

    // substract the payments from the total sums
    records.push(...(<(ImportedPayment | AccountingPayment)[]>data.payments).map(payment => ({
      type: null,
      paragraph: payment.paragraph,
      item: payment.item,
      event: payment.event,
      unit: payment.unit,
      amount: (-1) * payment.amount
    })));

    const options: ExportOptions = { delimiter: ";", encoding: "utf8", newline: "\r\n" };
    
    await this.downloadFile(this.createCSV(records, options), "data.csv", options.encoding);
  }
  async exportCityVizorEvents(data: ImportedData | AccountingData, syntheticAccount: number) {
    const events = data.events.filter(e => e.syntheticAccount === syntheticAccount)
      .map(event => {
        return {
          srcId: event.srcId,
          name: event.name
        }
      });
    const options: ExportOptions = { delimiter: ";", encoding: "utf8", newline: "\r\n" };
    await this.downloadFile(this.createCSV(events, options), "events.csv", options.encoding);
  }

  createCSV(data: any[], options: ExportOptions) {

    let header = options.header;

    if (!header) {
      header = data.reduce((acc, cur) => {
        Object.keys(cur).forEach(key => acc[key] = key);
        return acc;
      }, {});
    }

    // initiate csv string
    let csv = "";

    // create header
    csv += Object.values(header).join(options.delimiter) + options.newline;

    // append rows
    data.forEach(row => {
      csv += Object.keys(header)
        .map(key => {
          const value = row[key];
          if (typeof value === "string") return "\"" + value.replace(/"/g, "\"\"") + "\"";
          if (typeof value === "number") return String(value);
          if (value instanceof Date) return "\"" + value.toISOString().substr(0, 10) + "\"";
          if (!value) return "";
          return "[Invalid value]";
        })
        .join(options.delimiter)
      csv += options.newline;
    });

    return csv;

  }

  downloadFile(data: string, filename: string, encoding: string) {
    const buffer = iconv.encode(data, encoding);
    const blob = new Blob([this.toArrayBuffer(buffer)], {
      type: "text/plain;charset=" + this.encodingToCharset(encoding)
    });
    FileSaver.saveAs(blob, filename, { autoBom: false });
  }

  toArrayBuffer(myBuf: Buffer): ArrayBuffer {
    const myBuffer = new ArrayBuffer(myBuf.length);
    const res = new Uint8Array(myBuffer);
    for (let i = 0; i < myBuf.length; ++i) {
      res[i] = myBuf[i];
    }
    return myBuffer;
  }

  encodingToCharset(encoding: string): string {
    return encoding.replace("win", "windows-");
  }

}
