const request = require('request');
const EventEmitter = require('events');
const fs = require('fs');
const path = require("path");

const async = require("async");
const csvparse = require("csv-parse");

const { Writable } = require('stream');

var config = require("../../config/config");

const headerNames = {
  type: ["type","recordType","MODUL","DOKLAD_AGENDA"],
  paragraph: ["paragraph","PARAGRAF"],
  item: ["item","POLOZKA"],
  event: ["event","AKCE","ORG"],
  eventName: ["event","AKCE_NAZEV","ORG"],
  amount: ["amount","CASTKA"],
  date: ["date","DATUM","DOKLAD_DATUM"],
  counterpartyId: ["counterpartyId","SUBJEKT_IC"],
  counterpartyName: ["counterpartyName","SUBJEKT_NAZEV"],
  description: ["description","POZNAMKA"]
};

class Importer extends EventEmitter {
  
  constructor(etl){
    super();
    
    this.etl = etl;    
    
    this.modified = false;
    
    this.result = {};
    
    this.error;
  }
  
  importUrl(url,cb){
    
    if(!url) return cb(new Error("Missing url"));

    var downloader = this.createDownloadStream(url);
    downloader.on("error",(err,res,body) => this.error = err);
    
    var parser = this.createParser();
    parser.on("error",(err,res,body) => this.error = err);
    parser.on("end",cb());
    
    var reader = this.createReader();
    
    downloader.pipe(parser).pipe(reader);
  }
  
  importFile(path,cb){
    if(!path) return cb(new Error("Missing file path"));

    var file = fs.createReadStream(path);
    
    var parser = csvparse({delimiter: this.etl.delimiter, columns: this.parseHeader});
    parser.on("error",err => cb(err,true)); //true means modified
    parser.on("end",() =>cb(null,true));
    
    var reader = this.createReader();
    
    file.pipe(parser).pipe(reader);
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

    var error = false;
    
    // create request
    var downloader = request(httpOptions);

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
  
  createParser(cb){
    var parser = csvparse({delimiter: this.etl.delimiter, columns: this.parseHeader});
    return parser;
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
  
  parseHeader(headerLine){

    return headerLine.map(originalField => {

      // browser throught all the target fields if originalField is someones alias
      var matchedField = Object.keys(headerNames).find(name => {
        // check all the aliases if any is matched
        return headerNames[name].some(matchOptions => matchOptions.indexOf(originalField) >= 0)
      });
      
      // return matched or original field
      return matchedField || originalField;

    });

  }
  
  readLine(record){

    // emit event - must be before balance!
    if(record.event && record.eventName){
      let event = { srcId: record.event, name: record.eventName };
      this.emit("event",event);
    }

    // emit balance
    var balance = ["type","paragraph","item","event","amount"].reduce((bal,key) => (bal[key] = record[key],bal),{});
    this.emit("balance",balance);

    // emit payment
    if(balance.type === "KDF" || balance.type === "KOF"){
      let payment = ["type","paragraph","item","event","amount","date","counterpartyId","counterpartyName","description"].reduce((bal,key) => (bal[key] = record[key],bal),{});
      this.emit("payment",payment);
    }
  }

}

module.exports = Importer;