import { Import } from "../import";
import fs from "fs-extra";
import path from "path";
import { pipeline } from "stream";
import { promisify } from "util";
import { createCityvizorParser, createCityvizorTransformer } from "./parser";
import { DatabaseWriter } from "../db-writer";
import { PostprocessingTransformer } from "../postprocessing-transformer";
import { CityvizorFileType } from "./cityvizor-file-type";
import { importLogger } from "../import-logger";

export async function importCityvizor(options: Import.Options) {
  importLogger.log(`Starting import: ${JSON.stringify(options)}}`);

  const dirFiles = await fs.readdir(options.importDir);

  // identify the usable files in import dir
  const dataFile = dirFiles.filter(file => file.match(/^.*data.*\.csv/i))[0];
  const eventsFile = dirFiles.filter(file =>
    file.match(/^.*events.*\.csv/i)
  )[0];
  const paymentsFile = dirFiles.filter(file =>
    file.match(/^.*payments.*\.csv/i)
  )[0];
  const accountingFile = dirFiles.filter(file =>
    file.match(/^.*accounting.*\.csv/i)
  )[0];

  // Drop the records if not appending.
  if (!options.append) {
    if (paymentsFile) {
      await options
        .transaction("data.payments")
        .where({ profileId: options.profileId, year: options.year })
        .delete();
      importLogger.log("Deleted previous payment records from the DB.");
    }
    if (eventsFile) {
      await options
        .transaction("data.events")
        .where({ profileId: options.profileId, year: options.year })
        .delete();
      importLogger.log("Deleted previous event records from the DB.");
    }
    if (accountingFile) {
      await options
        .transaction("data.accounting")
        .where({ profileId: options.profileId, year: options.year })
        .delete();
      importLogger.log("Deleted previous accounting records from the DB.");
    }
    if (dataFile) {
      await options
        .transaction("data.payments")
        .where({ profileId: options.profileId, year: options.year })
        .delete();
      await options
        .transaction("data.accounting")
        .where({ profileId: options.profileId, year: options.year })
        .delete();
      importLogger.log(
        "Deleted previous payment and accounting records from the DB."
      );
    }
  }
  // .forEach does not play nice with async
  for (const fileType of [
    [dataFile, CityvizorFileType.DATA],
    [eventsFile, CityvizorFileType.EVENTS],
    [paymentsFile, CityvizorFileType.PAYMENTS],
    [accountingFile, CityvizorFileType.ACCOUNTING],
  ].filter(([f]) => f) as [string, CityvizorFileType][]) {
    const [file, type] = fileType;
    const filePath = path.join(options.importDir, file);
    const fileReader = fs.createReadStream(filePath);
    const cvParser = createCityvizorParser(type, options.profileType);
    const cvTransformer = createCityvizorTransformer(type, options);

    // The pipeline construct ensures every stream obtains the close signals
    // TODO: Remove the promisify workaround after upgrade to Node 15.x that has awaitable pipelines by default
    await promisify(pipeline)(
      fileReader,
      cvParser,
      cvTransformer,
      new PostprocessingTransformer(),
      new DatabaseWriter(options)
    );
  }
}
