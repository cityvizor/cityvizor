const request = require('request');
const EventEmitter = require('events');
const fs = require('fs');
const path = require("path");
const extractZip = require("extract-zip");
const rimraf = require("rimraf");
const async = require("async");
const csvparse = require("csv-parse");

var config = require("../../config/config");

class Importer extends EventEmitter {
  
  constructor(etl){
    super();
    
    this.etl = etl;    
    
    this.url = etl.dataFile;
    if(!this.url) return cb(new Error("Missing url in etl settings"));
    
    this.lastModified = etl.lastModified;
    this.etag = etl.etag;
    
    // temp folder to work in
    this.folder = path.join(config.storage.tmpDir,"autoImport_" + this.etl._id);
    //saved ZIP file
    this.zipFile = path.join(this.folder,"source.zip");
    
    // store if response was 200 or 304
    this.modified = false;
    
    this.result = {
      modified: false
    };
  }
  
  importUrl(cb){
    
    var tasks = [
      (cb) => this.createTempDir(cb),
      (cb) => this.download(cb),
      (cb) => this.unzip(cb),
      (cb) => this.parse(cb),
      (cb) => this.cleanup(cb)
    ];
    
    async.series(tasks,err => cb(err,this.modified));
    
  }
  
  importFile(files,cb){
    
    if(!files.dataFile) return cb(new Error("Missing file path"));
    
    this.modified = true;

    var tasks = [
      (cb) => this.createTempDir(cb),
      (cb) => fs.rename(files.dataFile,this.zipFile,cb),
      (cb) => this.unzip(cb),
      (cb) => this.parse(cb),
      (cb) => this.cleanup(cb)
    ];
    
    async.series(tasks,err => cb(err,this.modified));
    
  }
  
  createTempDir(cb){
    
    rimraf(this.folder,{glob:false},(err) => {
      
      if(err) return cb(err);

      fs.mkdir(this.folder,cb);
      
    });
    
  }

  download(cb){   

    // request definition
    var httpOptions = {
      url: this.url,
      headers: {}
    }

    if(this.lastModified) httpOptions.headers["If-Modified-Since"] = (new Date(this.lastModified)).toGMTString();
    if(this.etag) httpOptions.headers["If-None-Match"] = this.etag;

    var error = null;
    
    // create request
    var source = request(httpOptions);

    source.on("error",(err,res,body) => error = err);

    // listen to response in order to store the modified header
    source.on('response', (res) => {
      
      this.result.statusCode = res.statusCode;
      this.result.statusMessage = res.statusMessage;
      
      switch(res.statusCode){
        case 200:

          // we got new data, launch parser after unzip closes
          this.modified = true;

          // save last-modified
          this.result.lastModified = res.headers["last-modified"];
          this.result.etag = res.headers["etag"];
          
          break;
          
        case 304:
          this.modified = false;
          break;
          
        case 404:
          error = new Error("File not found.");
          break;
          
        default:
          error = new Error("Unknown error.");
      }
      
      
    });
    
    var file = fs.createWriteStream(this.zipFile);
    file.on("error",(err,res,body) => error = err);
    file.on("close",err => cb(err || error));
    
    source.pipe(file);
  }
  
  unzip(cb){
    
    // no data was downloaded
    if(!this.modified) return cb();
    
    extractZip(this.zipFile, {dir: this.folder}, cb);
  }
  
  parse(cb){
    
    // no data was downloaded
    if(!this.modified) return cb();

    var tasks = [
      cb => this.parseFile("SK.csv",cb),
      cb => this.parseFile("RU.csv",cb),
    ];

    async.series(tasks,cb);
    
  }

  parseFile(file,cb){
    
    var error = false;
    
    var source = fs.createReadStream(path.join(this.folder,file));
    source.on("error", err => (error = true,cb(err)));
    
    var parser = csvparse({delimiter: this.etl.delimiter || ";", columns: true});
    parser.on("error", err => (error = true,cb(err)));
      
    parser.on("data", chunk => {

      let amount = parseFloat(chunk["CASTKA_DAL"]) - parseFloat(chunk["CASTKA_MD"]);
      
      if(Number(chunk.POLOZKA) < 5000) amount = (-1) * amount;

      if(chunk.ORGANIZACE && chunk.ORGANIZACE_NAZEV){
        let event = { id: chunk.ORGANIZACE, name: chunk.ORGANIZACE_NAZEV };
        this.emit("event",event);
      }

      var balance = {
        type: file === "RU.csv" ? "ROZ" : chunk["DOKLAD_AGENDA"],
        paragraph: chunk["PARAGRAF"],
        item: chunk["POLOZKA"],
        eventId: chunk["ORGANIZACE"],
        amount: amount
      };
      
      this.emit("balance",balance);
      
      if(balance.type === "KDF" || balance.type === "KOF"){
        
        let payment = Object.assign(balance,{
          date: chunk["DOKLAD_DATUM"],
          counterpartyId: chunk["SUBJEKT_IC"],
          counterpartyName: chunk["SUBJEKT_NAZEV"],
          description: chunk["POZNAMKA"]
        });   
        
        this.emit("payment",payment);
      }

    });

    parser.on("end",err => !error && cb(err));

    source.pipe(parser);

  }
  
  cleanup(cb){
    // delete entire folder
    rimraf(this.folder,{glob:false},cb);
  }
  
}

module.exports = Importer;