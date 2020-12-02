import EventEmitter from 'events';
import fs, { ReadStream, createReadStream } from "fs-extra";
import mergeStream from "merge-stream";
import csvparse from "csv-parse";
import { Readable, Transform } from 'stream';
import { Importer } from './importer';
import logger from './logger';
import { AccountingRecord, PaymentRecord, EventRecord, ProfileRecord, YearRecord } from "../../schema/database";
import { ImportRecord } from '../../schema/database/import';
import { paramCase } from 'change-case';

const headerAliases = {
  type: ["type", "recordType", "MODUL", "DOKLAD_AGENDA"],
  paragraph: ["paragraph", "PARAGRAF"],
  item: ["item", "POLOZKA"],
  unit: ["unit", "ORJ"],
  event: ["eventId", "event", "AKCE", "ORG"],
  amount: ["amount", "CASTKA"],
  date: ["date", "DATUM", "DOKLAD_DATUM"],
  counterpartyId: ["counterpartyId", "SUBJEKT_IC"],
  counterpartyName: ["counterpartyName", "SUBJEKT_NAZEV"],
  description: ["description", "POZNAMKA"],
  id: ["id", "eventId", "srcId", "AKCE", "ORG"],
  name: ["name", "eventName", "AKCE_NAZEV"]
};

const mandatoryAccountingHeaders = [
  "type",
  "paragraph",
  "item",
  "event",
  "amount"
]

const mandatoryPaymentsHeaders = [
  "type",
  "paragraph",
  "item",
  "unit",
  "event",
  "amount",
  "date",
  "counterpartyId",
  "counterpartyName",
  "description"
]

const mandatoryEventHeaders = [
  "id",
  "name"
]

export class ImportParser {

  static createCsvParser(file: string): csvparse.Parser {
    let headers = []
    switch (file) {
      case "accountingFile":
        headers = mandatoryAccountingHeaders
        break
      case "paymentsFile":
      case "dataFile":
        headers = mandatoryPaymentsHeaders
        break
      case "eventsFile":
        headers = mandatoryEventHeaders
        break
      default:
        throw Error("Unexpected parser requested")
    }

    return csvparse({ delimiter: ";", columns: line => this.parseHeader(line, headers), relax_column_count: true });
  }

  static createCsvTransformer(file: string, options: Importer.Options): Transform {
    switch (file) {
      case "paymentsFile":
      case "dataFile":
      case "accountingFile":
        return this.createDataTransformer(options)
      case "eventsFile":
        return this.createEventsTransformer(options)
      default:
        throw Error("Unexpected parser requested")
    }
  }

  static createDataTransformer(options: Importer.Options) {
    return new Transform({
      writableObjectMode: true,
      readableObjectMode: true,
      transform: function (line, enc, callback) {
        const recordType = line["type"]

        if (recordType === "KDF" || recordType === "KOF") {
          try {
            let payment = ImportParser.createPaymentRecord(line, options)
            this.push({type: "payment", record: payment});
            callback()
          } catch (err) {
            callback(err)  
          }
        } else {
          var accounting = ImportParser.createAccountingRecord(line, options)
          this.push({type: "accounting", record: accounting});
          callback()
        } 
      }
    });

  }

  static createEventsTransformer(options: Importer.Options) {
    return new Transform({
      writableObjectMode: true,
      readableObjectMode: true,
      transform: function (line, enc, callback) {
        let event = ImportParser.createEventRecord(line, options)
        if (line.id && line.name) {
          this.push({type: "event", record: event});
          callback()
        }
        else {
          callback(new Error(`Missing event id; event name: ${line.name}`))
        }
    }
    });

  }

  static parseHeader(headerLine: string[], headerNames: string[]): string[] {
    // remove possible BOM at the beginning of file, also removes extra whitespaces
    headerLine = headerLine.map(item => item.trim())
    logger.log(`Searching for these headers: [${headerNames}]`)
    logger.log(`The header array being searched for field names: [${headerLine}]`)
    const foundHeaders: string[] = headerLine.map(originalField => {
      // browse through all the target fields if originalField is someones alias
      return Object.keys(headerAliases).find(key => headerAliases[key].indexOf(originalField) != -1)
    });
    headerNames.forEach(h => {
      if (foundHeaders.indexOf(h) == -1) {
        throw Error(`Failed to find column header "${h}"`)
      }
    })

    return foundHeaders

  }

  static createPaymentRecord(row: {}, options: Importer.Options): PaymentRecord {
    return ["type", "paragraph", "item", "event", "amount", "date", "counterpartyId", "counterpartyName", "description"].reduce((acc, c) => {
      switch(c) {
        case "date":
          const d = Date.parse(row[c])
          if (isNaN(d) || !/\d{4}-\d{2}-\d{2}/.test(row[c])) this.invalidField("date", "date", row)
          acc[c] = row[c]
          break
        case "paragraph":
        case "item":
        case "unit":
        case "event":
        case "amount":
          const n = Number(row[c])
          if (isNaN(n)) this.invalidField(c, "number", row) 
          acc[c] = n
          break
        case "counterpartyId":
        case "counterpartyName":
        case "description":
          acc[c] = row[c]
          break
      }
      return acc
    }, {
      profileId: options.profileId,
      year: options.year
    } as PaymentRecord)
  }

  static createAccountingRecord(row: {}, options: Importer.Options): AccountingRecord {
    return ["type", "paragraph", "item", "event", "unit", "amount"].reduce((acc, c) => {
      switch(c) {
        case "type":
          acc[c] = row[c]
          break
        case "paragraph":
        case "item":
        case "event":
        case "unit":
        case "amount":
          const n = Number(row[c])
          if (isNaN(n)) this.invalidField(c, "number", row) 
          acc[c] = n
          break
      }
      return acc
    }, {
      profileId: options.profileId,
      year: options.year
    } as AccountingRecord)
  }

  static createEventRecord(row: {}, options: Importer.Options): EventRecord {
    return ["id", "name", "description"].reduce((acc, c) => {
      switch(c) {
        case "name":
        case "description":
          acc[c] = row[c]
          break
        case "id":
          const n = Number(row[c])
          if (isNaN(n)) this.invalidField(c, "number", row) 
          acc[c] = n
          break
      }
      return acc
    }, {
      profileId: options.profileId,
      year: options.year
    } as EventRecord)
  }

  private static invalidField(field: string, type: string, row: {}): never {
    throw new Error(`Failed to convert field "${field}": ${row[field]} to ${type}.\nRow processed: ${JSON.stringify(row)}`)
  }

}