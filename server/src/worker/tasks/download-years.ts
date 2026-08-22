import { YearRecord } from "../../schema";
import { ImportRecord } from "../../schema/database/import";
import { CronTask } from "../../schema/cron";
import { db } from "../../db";
import axios from "axios";
import * as fs from "fs-extra";
import path from "path";
import extract from "extract-zip";
import { DateTime } from "luxon";
import { Import } from "../import/import";
import { pipeline } from "stream";
import { promisify } from "util";
import { validateInternetStreamInputFiles } from "../import/internetstream/input-files";

export const TaskDownloadYears: CronTask = {
  id: "download-years",
  name: "Download data for automatically imported years",
  exec: async () => {
    const years = await db<YearRecord>("app.years").whereNotNull("importUrl");
    for (const year of years) {
      let importDir: string | undefined;
      try {
        if (!year.importPeriodMinutes || !year.importUrl) continue;
        const lastImport = await db<ImportRecord>("app.imports")
          .first()
          .where("profileId", "=", year.profileId)
          .where("year", "=", year.year)
          .orderBy("created", "desc");
        if (
          !lastImport ||
          lastImport.created <
            new Date(Date.now() - 1000 * 60 * year.importPeriodMinutes)
        ) {
          importDir = await Import.createImportDir();
          await downloadAndExtractYear(year.importUrl, importDir);
          if (year.importFormat === "internetstream") {
            await validateInternetStreamInputFiles(importDir);
          }
          const importData: Partial<ImportRecord> = {
            profileId: year.profileId,
            year: year.year,

            created: DateTime.local().toJSDate(),
            status: "pending",
            error: undefined,
            append: false,
            importDir,
            format: year.importFormat,
          };
          await db<ImportRecord>("app.imports").insert(importData);
          console.log(`Downloaded ${year.importUrl}`);
        }
      } catch (err: unknown) {
        if (importDir) await fs.remove(importDir);
        console.error(
          `Downloading ${year.importUrl} failed: ${
            err instanceof Error ? err.message : err
          }`
        );
      }
    }
  },
};

async function downloadAndExtractYear(
  importUrl: string,
  importDir: string
) {
  const dataPath = path.join(importDir, "data.zip");
  const response = await axios.get(importUrl, { responseType: "stream" });
  await promisify(pipeline)(response.data, fs.createWriteStream(dataPath));
  await extract(dataPath, { dir: importDir });
}
