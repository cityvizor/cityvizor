import request from 'request';
import EventEmitter from 'events';
import fs from "fs-extra";
import path from "path";

import mergeStream from "merge-stream";

import async from "async";
import csvparse from "csv-parse";

import { Writable, Readable, Transform } from 'stream';

import config from "../../config";

const headerNames = {
  type: ["type", "recordType", "MODUL", "DOKLAD_AGENDA"],
  paragraph: ["paragraph", "PARAGRAF"],
  item: ["item", "POLOZKA"],
  unit: ["unit", "ORJ"],
  event: ["eventId", "event", "AKCE", "ORG"],
  amount: ["amount", "CASTKA"],
  date: ["date", "DATUM", "DOKLAD_DATUM"],
  counterpartyId: ["counterpartyId", "SUBJEKT_IC"],
  counterpartyName: ["counterpartyName", "SUBJEKT_NAZEV"],
  description: ["description", "POZNAMKA"]
};

const eventHeaderNames = {
  "id": ["id", "eventId", "srcId", "AKCE", "ORG"],
  "name": ["name", "eventName", "AKCE_NAZEV"]
}

export class ImportParser extends EventEmitter {

  modified = false;

  result = {};

  eventReader: Transform;
  dataReader: Transform;

  readable: NodeJS.ReadWriteStream;

  error: Error;

  constructor() {

    super();

    this.dataReader = this.createDataReader();

    this.eventReader = this.createEventsReader();

    this.readable = mergeStream(this.dataReader, this.eventReader)
  }

  async parseImport(files) {

    if (files.eventsFile) {
      var eventsFile = fs.createReadStream(files.eventsFile);
      await this.parseEvents(eventsFile, this.eventReader);
    }

    if (files.dataFile) {
      var dataFile = fs.createReadStream(files.dataFile);
      await this.parseData(dataFile, this.dataReader);
    }

  }

  async parseData(dataFile, reader) {
    return new Promise((resolve, reject) => {

      var error = false;

      var parser = csvparse({ delimiter: ";", columns: line => this.parseHeader(line, headerNames), relax_column_count: true });
      parser.on("error", err => (error = true, reject(err)));
      parser.on("end", () => !error && resolve());

      dataFile.pipe(parser).pipe(reader);
    });
  }

  async parseEvents(eventsFile, reader: Readable) {
    return new Promise((resolve, reject) => {

      var error = false;

      var parser = csvparse({ delimiter: ";", columns: line => this.parseHeader(line, eventHeaderNames), relax_column_count: true });
      parser.on("error", err => (error = true, reject(err)));
      parser.on("end", () => !error && resolve());

      eventsFile.pipe(parser).pipe(reader);
    });
  }

  createDataReader() {

    var reader = new Transform({
      writableObjectMode: true,
      readableObjectMode: true,
      transform: function (record, enc, callback) {

        // emit balance
        var balance = ["type", "paragraph", "item", "event", "amount"].reduce((bal, key) => (bal[key] = record[key], bal), {} as any);
        this.push({ type: "balance", data: balance });

        // emit payment
        if (balance.type === "KDF" || balance.type === "KOF") {
          let payment = ["type", "paragraph", "item", "event", "amount", "date", "counterpartyId", "counterpartyName", "description"].reduce((bal, key) => (bal[key] = record[key], bal), {});
          this.push({ type: "payment", data: payment });
        }

        callback();
      }
    });

    return reader;
  }

  createEventsReader() {

    var reader = new Transform({
      writableObjectMode: true,
      readableObjectMode: true,
      transform: function (line, enc, callback) {
        if (line.id && line.name) this.push({ type: "event", data: { id: line.id, name: line.name } });
        else this.emit("warning", "Missing event id");
        callback();
      }
    });

    return reader;
  }

  parseHeader(headerLine, names) {

    return headerLine.map(originalField => {

      // browser throught all the target fields if originalField is someones alias
      var matchedField = Object.keys(names).find(name => names[name].indexOf(originalField) >= 0);

      // return matched or original field
      return matchedField || originalField;

    });

  }


}