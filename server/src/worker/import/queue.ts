/* eslint-disable @typescript-eslint/dot-notation */
import { DateTime } from "luxon";
import { remove } from "fs-extra";
import { ImportRecord } from "../../schema/database/import";
import { db } from "../../db";
import { Import } from "./import";
import { ProfileRecord, YearRecord } from "../../schema";
import logger from "./logger";
import { importCityvizor } from "./cityvizor/importer";
import { importInternetStream } from "./internetstream/importer";
import { importPbo } from "./pbo/importer";

export async function checkImportQueue() {
  const runningJob = await db<ImportRecord>("app.imports")
    .where({ status: "processing" })
    .first();

  if (runningJob) {
    const startedBeforeMinutes = runningJob.started
      ? -1 * DateTime.fromJSDate(runningJob.started).diffNow("minutes").minutes
      : 0;

    // let the previous job run
    if (startedBeforeMinutes < 1) return;
    // clear the old job with timeout
    else {
      console.log("[WORKER] Found a stale job in queue, removing.");

      const updateDataStale: Partial<ImportRecord> = {
        status: "error",
        error: "Job timed out without proper finish.",
        finished: DateTime.local().toJSDate(),
      };

      await db<ImportRecord>("app.imports")
        .where({ id: runningJob.id })
        .update(updateDataStale);

      // remove used import data
      await remove(runningJob.importDir);
    }
  }

  const currentJob = await db<ImportRecord>("app.imports")
    .where({ status: "pending" })
    .orderBy("created", "asc")
    .first();

  if (!currentJob) return;

  const profile = await db<ProfileRecord>("app.profiles")
    .where({ id: currentJob.profileId })
    .first()
    .then(row => row);

  if (!profile) return;

  console.log(
    `[WORKER] ${DateTime.local().toJSDate()} Found a new ${
      currentJob.format
    } job, starting import for profile "${profile.name}" with type "${
      profile.type
    }"`
  );

  await db<ImportRecord>("app.imports")
    .where({ id: currentJob.id })
    .update({ status: "processing", started: DateTime.local().toJSDate() });

  logger.log("Starting the DB transaction.");

  const trx = await db.transaction();
  const options: Import.Options = {
    profileId: currentJob.profileId,
    year: currentJob.year,
    transaction: trx,
    importDir: currentJob.importDir,
    append: currentJob.append,
    format: currentJob.format,
    profileType: profile.type,
  };

  // Any exception catched in this try block will rollback the import transaction
  let error: Error | null = null;
  try {
    if (currentJob.format === "cityvizor") {
      await importCityvizor(options);
    } else if (currentJob.format === "internetstream") {
      await importInternetStream(options);
    } else if (
      currentJob.format === "pbo_expected_plan" ||
      currentJob.format === "pbo_real_plan" ||
      currentJob.format === "pbo_aa_names"
    ) {
      await importPbo(options);
    } else {
      throw Error(`Unsupported import type: ${currentJob.format}`);
    }
    await db<YearRecord>("app.years")
      .where({ profileId: currentJob.profileId, year: currentJob.year })
      .update({ validity: currentJob.validity });
  } catch (err) {
    console.error(`[WORKER] ${DateTime.local().toJSDate()} Import error`, err);
    if (err instanceof Error) {
      logger.log(`Import failed: ${err.message}`);
      logger.log(`Additonal information: ${err["detail"]}`);
      error = err;
    } else {
      logger.log(`Import failed: ${err}`);
    }
  } finally {
    // remove used import data
    if (error) {
      logger.log("Aborting the DB transaction, no changes made to the DB.");
      await trx.rollback();
    } else {
      logger.log("Import successful, committing the DB transaction.");
      await trx.commit();
    }
    await remove(currentJob.importDir);
  }

  console.log("___LOGS____");
  console.log(logger.getLogs());
  console.log("_____________");

  const updateData: Partial<ImportRecord> = {
    status: error ? "error" : "success",
    error: error ? error.message : null,
    finished: DateTime.local().toJSDate(),
    logs: logger.getLogs(),
  } as Partial<ImportRecord>;

  logger.clear();
  await db<ImportRecord>("app.imports")
    .where({ id: currentJob.id })
    .update(updateData);

  console.log(`[WORKER] ${DateTime.local().toJSDate()} Import finished.`);
}
