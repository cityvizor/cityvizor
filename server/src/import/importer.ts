// remove when import of ZIP sorted out
import unzip from "unzip";
import fs from "fs-extra";
import path from "path";
import config from "../config";

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

      var importfiles = {};

      if (importOptions.files.zipFile) {
        importfiles = await this.extractZip(importOptions.files.zipFile);
      }
      else {
        importfiles = importOptions.files
      }

      await parser.parseImport(importfiles);

    }
    catch (e) {
      err = e;
      console.error(e);
    }

    await this.logResults(importOptions, err);
  }

  async init(importOptions: Importer.Options) {

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
    catch (e) {
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