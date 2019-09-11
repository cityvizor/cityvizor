import request from 'request';
import EventEmitter from 'events';
import fs from "fs-extra";
import path from "path";

import async from "async";
import csvparse from "csv-parse";

import { Writable, Readable } from 'stream';

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

export class ImportParser extends Readable {

  modified = false;

  result = {};

  constructor() {
    super({
      objectMode: true
    });
  }

  async parseImport(files) {

    if (files.eventsFile) {
      var eventsFile = fs.createReadStream(files.eventsFile);
      await this.parseEvents(eventsFile);
    }

    if (files.dataFile) {
      var dataFile = fs.createReadStream(files.dataFile);
      await this.parseData(dataFile);
    }

  }

  async parseData(dataFile) {
    return new Promise((resolve, reject) => {

      var error = false;

      var parser = csvparse({ delimiter: ",", columns: line => this.parseHeader(line, headerNames) });
      parser.on("error", err => (error = true, reject(err)));
      parser.on("end", () => !error && resolve());

      var reader = this.createReader();
      reader.on("error", err => (error = true, reject(err)));

      dataFile.pipe(parser).pipe(reader);
    });
  }

  async parseEvents(eventsFile) {
    return new Promise((resolve, reject) => {

      var error = false;

      var parser = csvparse({ delimiter: ",", columns: line => this.parseHeader(line, eventHeaderNames) });
      parser.on("error", err => (error = true, reject(err)));
      parser.on("end", () => !error && resolve());

      var reader = this.createEventsReader();
      reader.on("error", err => (error = true, reject(err)));

      eventsFile.pipe(parser).pipe(reader);
    });
  }

  createReader() {

    var reader = new Writable({
      objectMode: true,
      write: (line, enc, callback) => {
        this.readLine(line);
        callback();
      }
    });

    return reader;
  }


  readLine(record) {

    // emit balance
    var balance = ["type", "paragraph", "item", "event", "amount"].reduce((bal, key) => (bal[key] = record[key], bal), {} as any);
    this.push({ type: "balance", data: balance });

    // emit payment
    if (balance.type === "KDF" || balance.type === "KOF") {
      let payment = ["type", "paragraph", "item", "event", "amount", "date", "counterpartyId", "counterpartyName", "description"].reduce((bal, key) => (bal[key] = record[key], bal), {});
      this.push({ type: "payment", data: payment });
    }
  }

  createEventsReader() {

    var reader = new Writable({
      objectMode: true,
      write: (line, enc, callback) => {
        this.push({ type: "event", data: { id: line.id, name: line.name } });
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