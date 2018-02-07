
const fs = require("fs");

var EventEmitter = require('events');

var csvparse = require("csv-parse");

var importConfig = require("../../config/import-config");

var CSVTransformer = require("./csv-transformer");

class Parser_Native extends EventEmitter{
  
  constructor(eventsFile, dataFile){
    super();
    this.eventsFile = eventsFile;
    this.dataFile = dataFile;
  }
  
  parseTo(target){
    
    return Promise.resolve()
      .then(() => this.parseEvents(target))
      .then(() => this.parseData(target))
      .then(() => target.save());
  }

  parseEvents(target){
    return new Promise((resolve,reject) => {

      var file = fs.createReadStream(this.eventsFile);
      file.on("error",err => reject(new Error("Číselník akcí: " + err.message)));
      
      var parser = csvparse({delimiter: ";"});
      parser.on("error",err => reject(new Error("Číselník akcí: " + err.message)));

      var transformer = new CSVTransformer(importConfig.events);
      transformer.on("error",err => reject(new Error("Číselník akcí: " + err.message)));
      transformer.on("data",event => target.writeEvent(event));

      transformer.on("warning",warning => this.emit("warning", "Číselník akcí: " + warning));

      transformer.on("end",() => resolve());

      file.pipe(parser).pipe(transformer);
      
    });
  }

  parseData(target){
    return new Promise((resolve,reject) => {

      /* PARSE DATA FILE */
      var file = fs.createReadStream(this.dataFile);
      file.on("error",err => reject(new Error("Datový soubor: " + err.message)));
      
      var parser = csvparse({delimiter: ";"});
      parser.on("error",err => reject(new Error("Datový soubor: " + err.message)));

      var transformer = new CSVTransformer(importConfig.data);
      transformer.on("error",err => reject(new Error("Datový soubor: " + err.message)));
        
      transformer.on("data",record => {
        target.writeRecord(record);
        if(record.type === "KDF" || record.type === "KOF") target.writePayment(record);
      });

      transformer.on("warning",warning => this.emit("warning", "Datový soubor: " + warning));

      transformer.on("end",() => resolve());

      file.pipe(parser).pipe(transformer);
      
    });
  }

}

module.exports = Parser_Native;