import fs from "fs-extra";
import path from "path";
import { createHash } from "crypto";
import { pipeline, Transform } from "stream";
import { promisify } from "util";
import { Import } from "../import";
import { DatabaseWriter } from "../db-writer";
import { importLogger } from "../import-logger";
import { PostprocessingTransformer } from "../postprocessing-transformer";
import { createKxxRecordStream, KxxRecord } from "./parser";
import { createKxxTransformer, transformKxxRecord } from "./transformer";

async function inputFiles(importDir: string): Promise<string[]> {
  const names = await fs.readdir(importDir);
  const files: string[] = [];
  for (const prefix of ["ucto", "rozp"]) {
    const matches = names.filter(name =>
      new RegExp(`^${prefix}.*\\.kxx$`, "i").test(name)
    );
    if (matches.length !== 1) {
      throw new Error(`KXX import requires exactly one ${prefix}*.kxx file.`);
    }
    const file = path.join(importDir, matches[0]);
    const stat = await fs.stat(file);
    if (!stat.isFile() || stat.size === 0) {
      throw new Error(`KXX input ${matches[0]} must be a non-empty file.`);
    }
    await fs.access(file, fs.constants.R_OK);
    files.push(file);
  }
  return files;
}

/** Both files use the transaction owned by the import queue. */
export async function importGinisKxx(
  options: Import.Options
): Promise<Import.Result & { warningCount: number }> {
  const files = await inputFiles(options.importDir);
  let warningCount = 0;
  let identity: string | undefined;
  importLogger.log("Starting GINIS KXX import.");

  const fingerprints = await Promise.all(
    files.map(async file => {
      const hash = createHash("sha256");
      for await (const chunk of fs.createReadStream(file)) hash.update(chunk);
      return hash.digest("hex");
    })
  );
  if (fingerprints[0] === fingerprints[1])
    throw new Error("KXX accounting and budget inputs must not be identical.");

  const checkRecord = (
    record: KxxRecord,
    file: string,
    accounting: boolean
  ) => {
    const fileName = path.basename(file);
    const current = `${record.organization}/${record.organizationUnit ?? ""}`;
    if (identity !== undefined && identity !== current)
      throw new Error(
        `KXX file ${fileName} has a different organization/unit.`
      );
    identity = current;
    if (
      (accounting && [2, 3, 7, 8].includes(record.type)) ||
      (!accounting && record.type === 0)
    )
      throw new Error(
        `KXX file ${fileName} contains records for the wrong file role (${accounting ? "accounting" : "budget"}).`
      );
  };

  // Validate both inputs before replacing data, without buffering records in memory.
  for (const [index, file] of files.entries()) {
    const parser = createKxxRecordStream(fs.createReadStream(file), undefined, {
      year: options.year,
    });
    let accountingCount = 0;
    for await (const record of parser) {
      checkRecord(record, file, index === 0);
      const chunks = transformKxxRecord(record, options);
      accountingCount += chunks.filter(
        chunk => chunk.type === "accounting"
      ).length;
    }
    if (accountingCount === 0)
      throw new Error(
        `KXX file ${path.basename(file)} does not contain any usable accounting records.`
      );
  }
  if (!options.append) {
    for (const table of ["data.payments", "data.accounting"]) {
      await options
        .transaction(table)
        .where({ profileId: options.profileId, year: options.year })
        .delete();
    }
    importLogger.log(
      "Deleted previous payment and accounting records from the DB."
    );
  }

  for (const [index, file] of files.entries()) {
    const fileName = path.basename(file);
    importLogger.log(`Reading KXX file ${fileName}.`);
    const parser = createKxxRecordStream(
      fs.createReadStream(file),
      warning => {
        warningCount++;
        importLogger.log(`WARNING KXX_PARSER: ${fileName}: ${String(warning)}`);
      },
      { year: options.year }
    );
    const checkIdentity = new Transform({
      objectMode: true,
      transform(record: KxxRecord, encoding, callback) {
        try {
          checkRecord(record, file, index === 0);
          callback(null, record);
        } catch (error) {
          callback(error as Error);
        }
      },
    });
    const transformer = createKxxTransformer({
      profileId: options.profileId,
      year: options.year,
      onDiagnostic: diagnostic => {
        warningCount++;
        importLogger.log(
          `WARNING ${diagnostic.code}: ${fileName}, record ${diagnostic.recordId}, type ${diagnostic.recordType}: ${diagnostic.reason}; skipped.`
        );
      },
    });
    const writer = new DatabaseWriter({ ...options, fileName: file });
    await promisify(pipeline)(
      parser,
      checkIdentity,
      transformer,
      new PostprocessingTransformer(),
      writer
    );
    if (writer.accountingCount === 0) {
      throw new Error(
        `KXX file ${fileName} does not contain any usable accounting records.`
      );
    }
  }
  importLogger.log(`KXX import completed with ${warningCount} warnings.`);
  return { accountingChanged: true, warningCount };
}
