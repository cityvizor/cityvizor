// remove when import of ZIP sorted out
import { ImportParser } from "./parser";
import { ImportWriter } from "./writer";
import { YearRecord, UserRecord } from "../schema";

export class Importer {

  userId;
  autoImport;

  source = null;

  // collect warnings from all of the parts
  warnings: string[] = [];

  validity: Date;

  constructor(options) {

    this.userId = options && options.userId || null;
    this.autoImport = options ? !!options.autoImport : false;
  }

  async import(importOptions) {

    // parse arguments
    if (importOptions && importOptions.validity) {
      this.validity = new Date(importOptions.validity) || null
    }

    if (!importOptions.profileId) throw new Error("Missing profileId");
    if (!importOptions.year) throw new Error("Missing year");

    // prepare stream
    const parser = new ImportParser();
    parser.on("warning", warning => this.warnings.push(warning));

    const writer = new ImportWriter(importOptions);
    writer.on("warning", warning => this.warnings.push(warning));

    parser.pipe(writer);

    var err: Error;

    // import data
    try {
      await this.init(importOptions);

      await writer.clear();

      await parser.parseImport(importOptions.files);

    }
    catch (e) {
      err = e;
      console.error(e);
    }

    await this.logResults(importOptions, err);
  }

  async init(importOptions: Importer.Options) {

  }

  async logResults(importOptions: Importer.Options, err?: Error) {

    console.log(err);

  }

}

export namespace Importer {

  export interface OptionsFilesCSV {
    dataFile: string;
    eventsFile?: string;
    paymentsFile?: string;
  }

  export interface OptionsFilesZIP {
    zipFile: string;
  }

  export interface Options {
    profileId: YearRecord["profileId"];
    year: YearRecord["year"];
    validity: Date | string;
    userId?: UserRecord["id"];
    files: OptionsFilesCSV | OptionsFilesZIP;
  }
}