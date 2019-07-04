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

    if (options && options.validity) {
      this.validity = new Date(options.validity) || null
    }

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

    try {
      await this.init(etl);

      await parser.parseImport(options.files);

      const data = transformer.finish();

      await writer.save(data);
    }
    catch (e) { err = e; }

    await this.logResults(etl, err);
  }

  async init(etl) {
    etl.status = "processing";
    await etl.save();
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