import { DateTime } from "luxon";
import { readdir } from "fs-extra";
import path from "path";
import { ImportRecord } from "../../schema/database/import";
import { db } from "../../db";
import { Importer } from "./importer";
import config from "../../config";

export async function checkImportQueue() {

  const runningJob = await db<ImportRecord>("app.imports").where({ status: "processing" }).first();

  if (runningJob) {

    const startedBefore = DateTime.fromISO(runningJob.started).diffNow();

    // let the previous job run
    if (startedBefore.minutes < 5) return;

    // clear the old job with timeout
    else {
      const updateData: Partial<ImportRecord> = { status: "error", error: "Job timed out without proper finish.", finished: DateTime.local().toISO() };
      db<ImportRecord>("app.imports").where({ id: runningJob.id }).update(updateData)
    }

  }

  const currentJob = await db<ImportRecord>("app.imports").where({ status: "pending" }).orderBy("created", "asc").first();

  // start import
  const importer = new Importer({
    profileId: currentJob.profileId,
    year: currentJob.year
  });

  let error: Error;

  try {

    // get all files to be imported
    const importDir = path.resolve(config.storage.imports, "import_" + currentJob.id)
    const dirFiles = await readdir(importDir);

    // identify the usable files in dir
    const dataFile = dirFiles.filter(file => file.match(/^*.data*.\.csv/i))[0];
    const eventsFile = dirFiles.filter(file => file.match(/^*.events*.\.csv/i))[0];
    const paymentsFile = dirFiles.filter(file => file.match(/^*.payments*.\.csv/i))[0];

    // add path and make Importer.OptionFiles obect
    const files: Importer.OptionsFiles = {
      dataFile: dataFile ? path.join(importDir, dataFile) : null,
      eventsFile: eventsFile ? path.join(importDir, eventsFile) : null,
      paymentsFile: paymentsFile ? path.join(importDir, paymentsFile) : null
    };

    // import the files
    await importer.import(files);

  }
  catch (err) {
    console.error("Import error", err);
    error = err;
  }

  const updateData: Partial<ImportRecord> = {
    status: error ? "error" : "success",
    error: error ? error.message : null,
    finished: DateTime.local().toISO()
  };

  await db<ImportRecord>("app.imports").where({ id: currentJob.id }).update(updateData);

}
