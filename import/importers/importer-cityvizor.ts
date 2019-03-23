import { ImportedData, ImportedRecord, ImportedPayment, ImportedEvent } from "app/shared/schema";

import * as Papa from "papaparse";
import { Importer } from "../schema/importer";

export class ImporterCityVizor implements Importer {

  bytesRead = 0;
  bytesTotal = Infinity;

  payments: ImportedPayment[] = [];
  records: ImportedRecord[] = [];
  events: ImportedEvent[] = [];

  private recordIndex: { [key: string]: ImportedRecord } = {}

  constructor() { }

  async import(files: { data: File, events: File }): Promise<ImportedData> {

    this.bytesTotal = (files.data ? files.data.size : 0) + (files.events ? files.events.size : 0);

    await this.readCSV(files.events, result => {
      this.updateProgress(this.bytesRead + result.meta.cursor);
      this.events.push(...result.data
        .filter((row: { srcId: string, name: string }) => row["srcId"] && row["name"])
        .map(row => ({ srcId: Number(row["srcId"]), name: row["name"] }))
      );
    });

    await this.readCSV(files.data, result => {
      this.updateProgress(this.bytesRead + result.meta.cursor);
      this.records.push(...result.data.map(row => ({
        paragraph: Number(row["paragraph"]),
        item: Number(row["paragraph"]),
        event: Number(row["paragraph"]),
        budgetAmount: Number(row["budgetAmount"]) || 0,
        amount: Number(row["amount"]) || 0
      })));
      this.payments.push(...result.data
        .filter(row => row["type"] === "KDF" || row["type"] === "KOF")
        .map(row => ({
          type: row["type"],
          id: row["id"],
          counterparty_id: row["counterparty_id"],
          counterparty_name: row["counterparty_name"],
          amount: Number(row["amount"]),
          comment: row["comment"],
          paragraph: Number(row["paragraph"]),
          item: Number(row["item"]),
          event: Number(row["event"])
        }))
      );
    });

    return {
      payments: this.payments,
      records: this.records,
      events: this.events
    };

  }

  updateProgress(bytesRead: number) {
    this.bytesRead = bytesRead;
    postMessage({ type: "progress", data: bytesRead / this.bytesTotal })
  }

  readCSV(file: File, callback: (result: Papa.ParseResult) => void) {
    return new Promise((resolve, reject) => {

      Papa.parse(file, {
        header: true,
        encoding: "utf-8",
        chunk: callback,
        complete: (results, file) => resolve(),
        error: (err, file) => reject(err)
      });

    });
  }

}