// remove when import of ZIP sorted out
const unzip = require("unzip");
const fs = require("fs-extra");
const path = require("path");
const config = require("../../../config");

var ETLLog = require("../../models/etl-log");

var ImportParser = require("./parser");
var ImportTransformer = require("./transformer");
var ImportWriter = require("./writer");

class Importer {

  constructor(options) {

    this.userId = options && options.userId || null;
    this.autoImport = options ? !!options.autoImport : false;

    this.source = null;

    // collect warnings from all of the parts
    this.warnings = [];

    // we want to have the importer in the same scope as transformer and writer, so we can access it later
    var importer;
  }

  async import(etl, options) {

    // parse arguments
    if (options && options.validity) {
      this.validity = new Date(options.validity) || null
    }

    // prepare stream
    const parser = new ImportParser();
    parser.on("warning", warning => this.warnings.push(warning));

    const transformer = new ImportTransformer(etl);
    transformer.on("warning", warning => this.warnings.push(warning));

    const writer = new ImportWriter(etl);
    writer.on("warning", warning => this.warnings.push(warning));

    parser.on("event", event => transformer.writeEvent(event));
    parser.on("counterparty", counterparty => transformer.writeCounterparty(counterparty));
    parser.on("balance", balance => transformer.writeBalance(balance));
    parser.on("payment", payment => transformer.writePayment(payment));

    var err;

    // import data
    try {
      await this.init(etl);

      var importfiles = {};

      if (options.files.zipFile) {
        importfiles = await this.extractZip(options.files.zipFile);
      }
      else{
        importfiles = options.files
      }

      console.log(importfiles);

      await parser.parseImport(importfiles);

      const data = transformer.finish();

      await writer.save(data);
    }
    catch (e) {
      err = e;
      console.error(e);
    }

    await this.logResults(etl, err);
  }

  async init(etl) {
    etl.status = "processing";
    await etl.save();
  }

  async extractZip(zipFile) {

    const unzipDir = path.join(config.storage.tmp, "import-zip");

    try {
      // TODO: redo after testing with Gordic
      // If zip file provided choose the largest CSV as dataFile and second largest as 
      await fs.remove(unzipDir);
      await fs.ensureDir(unzipDir);

      await new Promise((resolve, reject) => {
        const stream = fs.createReadStream(zipFile).pipe(unzip.Extract({ path: unzipDir }));
        stream.on("close", () => resolve());
        stream.on("error", err => reject(err));
      });
    }
    catch (e){
      throw new Error("Unable to extract ZIP file: " + e.message);
    }

    const csvFiles = (await fs.readdir(unzipDir))
      .filter(file => file.match(/\.csv$/i))
      .map(file => {
        const csvPath = path.join(unzipDir, file);
        return {
          path: csvPath,
          size: fs.statSync(csvPath).size
        };
      });

    csvFiles.sort((a, b) => b.size - a.size);

    return {
      dataFile: csvFiles[0] ? csvFiles[0].path : null,
      eventsFile: csvFiles[1] ? csvFiles[1].path : null
    }


  }

  async logResults(etl, err) {


    // create etl log entry
    var etllog = new ETLLog({
      profile: etl.profile,
      etl: etl._id,
      timestamp: new Date(),
      user: this.userId,

      error: err && err.message,

      warnings: this.warnings
    });

    // upadte ETL info
    etl.lastCheck = new Date();

    etl.status = err ? "error" : "success";
    etl.error = err ? err.message : null;

    let validity = this.validity || new Date();

    etl.warnings = this.warnings;
    etl.validity = validity;

    etllog.validity = validity;


    await etl.save();
    await etllog.save();

  }

}

module.exports = Importer;