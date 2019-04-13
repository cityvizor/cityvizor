const request = require('request');
const EventEmitter = require('events');
const fs = require("fs-extra");
const path = require("path");

const async = require("async");
const csvparse = require("csv-parse");

const { Writable } = require('stream');

var config = require("../../../config");

const headerNames = {
  type: ["type","recordType","MODUL","DOKLAD_AGENDA"],
  paragraph: ["paragraph","PARAGRAF"],
  item: ["item","POLOZKA"],
  eventId: ["eventId","event","AKCE","ORG"],
  eventName: ["event","AKCE_NAZEV"],
  amount: ["amount","CASTKA"],
  date: ["date","DATUM","DOKLAD_DATUM"],
  counterpartyId: ["counterpartyId","SUBJEKT_IC"],
  counterpartyName: ["counterpartyName","SUBJEKT_NAZEV"],
  description: ["description","POZNAMKA"]
};

const eventHeaderNames = {
  "id": ["id","eventId","srcId","AKCE","ORG"],
  "name": ["name","eventName","AKCE_NAZEV"]
}

class Importer extends EventEmitter {

  constructor(etl){
    super();

    this.etl = etl;    

    this.modified = false;

    this.result = {};
  }

  importUrl(cb){

    if(!this.etl.dataFile) return cb(new Error("Missing data file url"));
    if(!this.etl.eventsFile) return cb(new Error("Missing events file url"));

    var tasks = [

      cb => {
        var eventsFile = this.createDownloader(this.etl.eventsFile);
        this.parseEvents(eventsFile,cb);
      },

      cb => {
        var dataFile = this.createDownloader(this.etl.dataFile);
        this.parseData(dataFile,cb);
      }

    ];

    async.series(tasks, err => cb(err || this.error,this.modified));
  }

  importFile(files,cb){

    if(!files.dataFile) return cb(new Error("Missing file path"));
    if(!files.eventsFile) return cb(new Error("Missing events file path"));

    var tasks = [

      cb => {
        var eventsFile = fs.createReadStream(files.eventsFile);
        this.parseEvents(eventsFile,cb);
      },

      cb => {
        var dataFile = fs.createReadStream(files.dataFile);
        this.parseData(dataFile,cb);
      }

    ];

    async.series(tasks,err => cb(err,true));

  }

  parseData(dataFile,cb){

    var error = false;
    
    var parser = csvparse({delimiter: this.etl.delimiter, columns: line => this.parseHeader(line,headerNames)});
    parser.on("error",err => (error = true,cb(err)));
    parser.on("end",() => !error && cb());

    var reader = this.createReader();
    reader.on("error",err => (error = true,cb(err)));

    dataFile.pipe(parser).pipe(reader);
  }

  parseEvents(eventsFile,cb){
    
    var error = false;

    var parser = csvparse({delimiter: this.etl.delimiter, columns: line => this.parseHeader(line,eventHeaderNames)});
    parser.on("error",err => (error = true,cb(err)));
    parser.on("end",() => !error && cb());

    var reader = this.createEventsReader();
    reader.on("error",err => (error = true,cb(err)));

    eventsFile.pipe(parser).pipe(reader);
  }

  createDownloader(url){

    // request definition
    var httpOptions = {
      url: this.url,
      headers: {},
      gzip: true
    }

    if(this.etl.lastModified) httpOptions.headers["If-Modified-Since"] = (new Date(this.lastModified)).toGMTString();
    if(this.etl.etag) httpOptions.headers["If-None-Match"] = this.etag;

    // create request
    var downloader = request(httpOptions);
    
    // save error
    downloader.on("error",(err,res,body) => this.error = err);

    // listen to response in order to store the modified header
    downloader.on('response', (res) => {

      this.result.statusCode = res.statusCode;
      this.result.statusMessage = res.statusMessage;

      if(res.statusCode === 200){

        // we got new data, launch parser after unzip closes
        this.modified = true;

        // save last-modified
        this.result.lastModified = res.headers["last-modified"];
        this.result.etag = res.headers["etag"];
      }
    });

    return downloader;
  }

  createReader(){

    var reader = new Writable({
      objectMode: true,
      write: (line,enc,callback) => {
        this.readLine(line);
        callback();
      }
    });

    return reader;
  }


  readLine(record){

    // emit balance
    var balance = ["type","paragraph","item","eventId","amount"].reduce((bal,key) => (bal[key] = record[key],bal),{});
    this.emit("balance",balance);

    // emit payment
    if(balance.type === "KDF" || balance.type === "KOF"){
      let payment = ["type","paragraph","item","eventId","amount","date","counterpartyId","counterpartyName","description"].reduce((bal,key) => (bal[key] = record[key],bal),{});
      this.emit("payment",payment);
    }
  }

  createEventsReader(){

    var reader = new Writable({
      objectMode: true,
      write: (line,enc,callback) => {
        this.emit("event",{ id: line.id, name: line.name });
        callback();
      }
    });

    return reader;
  }

  parseHeader(headerLine,names){

    return headerLine.map(originalField => {

      // browser throught all the target fields if originalField is someones alias
      var matchedField = Object.keys(names).find(name => names[name].indexOf(originalField) >= 0);

      // return matched or original field
      return matchedField || originalField;

    });

  }


}

module.exports = Importer;