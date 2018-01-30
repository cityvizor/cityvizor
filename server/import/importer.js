
var async = require("async");

var ETL = require("../models/etl");
var ETLLog = require("../models/etl-log");

var ImportTransformer = require("../import/transformer");
var ImportWriter = require("../import/writer.db");

const importers = {
  "internet-stream": require("../import/importers/importer.internet-stream"),
  "cityvizor-v1": require("../import/importers/importer.cityvizor-v1"),
  "cityvizor-v2": require("../import/importers/importer.cityvizor-v2")
};

class Importer {

  constructor(etl,options){
    
    this.etl = etl; 
    
    this.profileId = etl.profile._id || etl.profile;
    
    this.validity = null;
    if(options && options.validity){
      this.validity = new Date(options.validity) || null
    }
    this.userId = options && options.userId || null;
    this.autoImport = options ? !!options.autoImport : false;
    
    this.source = null;

    // collect warnings from all of the parts
    this.warnings = [];

    this.writer = new ImportWriter(etl);
    this.writer.on("warning",warning => this.warnings.push(warning));

    this.transformer = new ImportTransformer(etl);
    this.transformer.on("warning",warning => this.warnings.push(warning));

    // we want to have the importer in the same scope as transformer and writer, so we can access it later
    var importer;
  }  

  import(source,files,cb){
    
    this.source = source;
    
    var tasks = [

      cb => this.init(cb),

      cb => this.createImporter(cb),

      (importer,cb) => {
        if(source === "url") return importer.importUrl(cb);
        if(source === "file") return importer.importFile(files,cb);
      },

      (modified,cb) => {
        
        if(modified) this.transformer.finish((err,data) => cb(null,modified,data))
        else cb(null,modified,null);
      },

      (modified,data,cb) => {
        if(modified) this.writer.save(data,err => cb(err,modified));
        else cb(null,modified);
      }

    ];

    async.waterfall(tasks, (err,modified) => {
      this.logResults(err,modified,(err,result) => cb(err,result));
    });
  }
  
  importFile(files,cb){
    return this.import("file",files,cb);
  }
  importUrl(cb){
    return this.import("url",null,cb);
  }

  init(cb){
    this.etl.status = "pending";
    this.etl.save(err => cb(err));
  }

  createImporter(cb){
    
    var Importer = importers[this.etl.importer];

    if(!Importer){
      var message = "Invalid importer \"" + this.etl.importer + "\"";
      return cb(new Error(message));
    }
    
    let importer = this.importer = new Importer(this.etl);
    importer.on("warning",warning => this.warnings.push(warning));
    importer.on("event", event => this.transformer.writeEvent(event));
    importer.on("balance", balance => this.transformer.writeBalance(balance));
    importer.on("payment", payment => this.transformer.writePayment(payment));
    
    cb(null,importer);

  }

  logResults(err,modified,cb){
    
    let etl = this.etl;
    let result = this.importer ? this.importer.result : null;

    // create etl log entry
    var etllog = new ETLLog({
      profile: this.profileId,
      etl: etl._id,
      timestamp: new Date(),
      user: this.userId,
      autoImport: this.autoImport,

      statusCode: result && result.statusCode,
      statusMessage: result && result.statusMessage,
      error: err && err.message,

      source: this.source,

      warnings: this.warnings
    });

    // upadte ETL info
    etl.lastCheck = new Date();

    if(err){
      etl.status = "error";
      if(err) etllog.error = etl.error = err.message;
      else if(result) etllog.error = etl.error = result.statusCode + " " + result.statusMessage;
    }
    else{

      etl.status = "success";
      etl.error = null;
      
      if(modified){

        let validity = this.validity || (result.validity ? new Date(result.validity) : null) || (result.lastModified ? new Date(result.lastModified) : new Date());
        let lastModified = result.lastModified ? new Date(result.lastModified) : null;

        
        etl.warnings = this.warnings;
        etl.validity = validity;
        etl.lastModified = lastModified;
        etl.etag = result.etag || null;

        etllog.validity = validity;
        etllog.lastModified = lastModified;
      }
    }


    etl.save()
      .then(() => etllog.save())
      .then(() => {
        if(err) cb(err);
        else if(modified) cb(null,"New data imported.");
        else cb(null,"Not modified.");
      })
      .catch(err => cb(err));

  }

}

module.exports = Importer;