// remove when import of ZIP sorted out
import { ImportParser } from "./parser";
import { ImportTransformer } from "./transformer";
import { ImportWriter } from "./writer";
import { YearRecord } from "../../schema";

export class Importer {

  userId;
  autoImport;

  source = null;

  // collect warnings from all of the parts
  warnings: string[] = [];

  validity: Date;

  constructor(private options: Importer.Options) {
    if (!options.profileId) throw new Error("Missing profileId");
    if (!options.year) throw new Error("Missing year");
  }

  async import(files: Importer.OptionsFiles) {

    // prepare stream
    const parser = new ImportParser();
    parser.on("warning", warning => this.warnings.push(warning));

    const transformer = new ImportTransformer();
    transformer.on("warning", warning => this.warnings.push(warning));

    const writer = new ImportWriter(this.options);
    writer.on("warning", warning => this.warnings.push(warning));

    parser.readable.pipe(transformer).pipe(writer);

    await writer.clear();

    // import data
    await parser.parseImport(files);

  }

}

export namespace Importer {

  export interface OptionsFiles {
    dataFile: string;
    eventsFile?: string;
    paymentsFile?: string;
  }

  export interface Options {
    profileId: YearRecord["profileId"];
    year: YearRecord["year"];
  }
}