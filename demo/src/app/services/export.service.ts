import { Injectable } from '@angular/core';
import { AccountingData, ImportedData, AccountingPayment, AccountingRecord, ImportedPayment, ImportedRecord } from 'app/shared/schema';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  delimiter = ";"
  newline = "\r\n";

  constructor() { }

  async export(data: AccountingData | ImportedData) {

    const records: (AccountingPayment | AccountingRecord | ImportedRecord | ImportedPayment)[] = [
      ...data.records,
      ...data.payments
    ];

    const files = {
      "records.csv": this.createCSV(records),
      "events.csv": this.createCSV(data.events)
    };

    const zip = await this.createZip(files);

    this.downloadFile(zip);

  }

  createZip(files: {}) {

  }

  createCSV(data: any[]) {

    // infer header from data
    const header = Object.keys(data.reduce((acc, cur) => {
      Object.keys(cur).forEach(key => acc[key] = true);
      return acc;
    }, {}));

    // initiate csv string
    var csv = "";

    // create header
    csv += header.join(this.delimiter) + this.newline;

    // append rows
    data.forEach(row => {
      csv += header
        .map(key => {
          const value = row[key];
          if (typeof value === "string") return "\"" + value + "\"";
          if (typeof value === "number") return value;
          if (value instanceof Date) return "";
          return "[Invalid value]";
        })
        .join(this.delimiter)
      csv += this.newline;
    });

    return csv;

  }

  downloadFile(file) {

  }

}
