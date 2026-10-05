import minimist from "minimist";

import { db, dbDestroy } from "../db";
import { ProfileRecord, YearRecord } from "../schema";
import { rebuildAccountingSummaries } from "../worker/import/accounting-summaries";

interface ProfileYear {
  profileId: ProfileRecord["id"];
  year: YearRecord["year"];
}

function parseIntegerOption(
  value: unknown,
  optionName: string
): number | undefined {
  if (value === undefined) return undefined;

  const parsed = Number(value);
  if (!Number.isInteger(parsed)) {
    throw new Error(`Option --${optionName} must be an integer.`);
  }
  return parsed;
}

async function run() {
  const args = minimist(process.argv.slice(2));
  const profileId = parseIntegerOption(args.profile, "profile");
  const year = parseIntegerOption(args.year, "year");

  const query = db<ProfileYear>("app.years as y")
    .select("y.profileId", "y.year")
    .innerJoin("app.profiles as p", "p.id", "y.profileId")
    .where("p.type", "municipality")
    .orderBy("y.profileId")
    .orderBy("y.year");

  if (profileId !== undefined) query.andWhere("y.profileId", profileId);
  if (year !== undefined) query.andWhere("y.year", year);

  const profileYears = await query;
  console.log(`Rebuilding ${profileYears.length} accounting summaries.`);

  for (const profileYear of profileYears) {
    const startedAt = Date.now();
    await db.transaction(async trx => {
      await rebuildAccountingSummaries(
        trx,
        profileYear.profileId,
        profileYear.year
      );
    });
    console.log(
      `Rebuilt profile ${profileYear.profileId}, year ${profileYear.year} in ${
        Date.now() - startedAt
      } ms.`
    );
  }
}

(async () => {
  try {
    await run();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    await dbDestroy();
  }
})();
