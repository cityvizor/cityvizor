import { ImportedData, ImportedRecord, ImportedPayment, ImportedEvent } from "app/shared/schema";

import * as Papa from "papaparse";
import { Importer } from "../schema/importer";

export interface CityVizorDataFile {
  type: string;
  paragraph: number;
  item: number;
  amount: number;

  event?: number;
  unit?: number;

  date?: string;
  counterpartyId?: string;
  counterpartyName?: string;
  description?: string;
}

export interface CityVizorEventsFile {
  srcId: number;
  name: stringSELECT DISTINCT(codelist) FROM data.codelists;;
  description?: string;
}


export class ImporterCityVizor implements Importer {

  bytesRead = 0;
  bytesTotal = Infinity;

  payments: ImportedPayment[] = [];
  records: ImportedRecord[] = [];
  events: ImportedEvent[] = [];

  private recordIndex: { [key: string]: ImportedRecord } = {}

  constructor() { }

  async import(files: { data: File, events: File }, options?: any): Promise<ImportedData> {

    this.bytesTotal = (files.data ? files.data.size : 0) + (files.events ? files.events.size : 0);

    if (files.events) {
      await this.readCSV(files.events, result => {
        this.updateProgress(this.bytesRead + result.meta.cursor);
        this.events.push(
          ...result.data
            .filter((row: CityVizorEventsFile) => row.srcId && row.name)
            .map((row: CityVizorEventsFile) => ({ srcId: Number(row.srcId), name: row.name }))
        );
      });
    }
    if (files.data) {
      await this.readCSV(files.data, result => {
        this.updateProgress(this.bytesRead + result.meta.cursor);
        this.records.push(...result.data.map((row: CityVizorDataFile) => ({
          paragraph: row.paragraph ? Number(row.paragraph) : null,
          item: row.item ? Number(row.item) : null,
          event: row.event ? Number(row.event) : null,
          unit: row.unit ? Number(row.unit) : null,
          budgetAmount: row.type === "ROZ" ? Number(row.amount) || 0 : 0,
          amount: row.type !== "ROZ" ? Number(row.amount) || 0 : 0
        })));
        this.payments.push(...result.data
          .filter(row => row["type"] === "KDF" || row["type"] === "KOF")
          .map(row => ({
            type: row.type,
            id: row.id,
            date: new Date(row.date),
            counterpartyId: row.counterpartyId,
            counterpartyName: row.counterpartyName,
            amount: Number(row.amount),
            description: row.description,
            paragraph: Number(row.paragraph),
            item: Number(row.item),
            event: Number(row.event),
            unit: Number(row.unit)
          }))
        );
      });
    }

    return {
      payments: this.payments,
      records: this.records,
      events: this.events
    };

  }

  updateProgress(bytesRead: number) {
    this.bytesRead = bytesRead;
    postMessage({ type: "progress", data: bytesRead / this.bytesTotal }, null)
  }

  readCSV(file: File, callback: (result: Papa.ParseResult<any>) => void) {
    return new Promise<any | void>((resolve, reject) => {

      Papa.parse(file, {
        header: true,
        encoding: "utf-8",
        chunk: callback,
        complete: (results, file) => resolve(results),
        error: (err, file) => reject(err)
      });

    });
  }

}