const request = require('request');
const EventEmitter = require('events');
const fs = require("fs-extra");
const path = require("path");

const async = require("async");
const csvparse = require("csv-parse");

const { Writable } = require('stream');

var config = require("../../config");

const headerNames = {
  type: ["type", "recordType", "MODUL", "DOKLAD_AGENDA"],
  paragraph: ["paragraph", "PARAGRAF"],
  item: ["item", "POLOZKA"],
  eventId: ["eventId", "event", "AKCE", "ORG"],
  eventName: ["event", "AKCE_NAZEV"],
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

  constructor(private etl) {
    super();
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

      var parser = csvparse({ delimiter: this.etl.delimiter, columns: line => this.parseHeader(line, eventHeaderNames) });
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
    var balance = ["type", "paragraph", "item", "eventId", "amount"].reduce((bal, key) => (bal[key] = record[key], bal), {} as any);
    this.emit("balance", balance);

    // emit payment
    if (balance.type === "KDF" || balance.type === "KOF") {
      let payment = ["type", "paragraph", "item", "eventId", "amount", "date", "counterpartyId", "counterpartyName", "description"].reduce((bal, key) => (bal[key] = record[key], bal), {});
      this.emit("payment", payment);
    }
  }

  createEventsReader() {

    var reader = new Writable({
      objectMode: true,
      write: (line, enc, callback) => {
        this.emit("event", { id: line.id, name: line.name });
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