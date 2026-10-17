import minimist from "minimist";

import type { ProfileRecord, YearRecord } from "../schema";

const usage = `Usage:
  npm run rebuild-accounting-summaries -- --all
  npm run rebuild-accounting-summaries -- --profile <id> [--year <year>]
  npm run rebuild-accounting-summaries -- --year <year>

Rebuilds summaries for municipality profiles, including hidden profiles and years.

Options:
  --all           Rebuild all profiles and years. Cannot be combined with filters.
  --profile <id>  Rebuild only this profile. Requires a positive integer.
  --year <year>   Rebuild only this year. Requires a positive integer.
  --help, -h      Show this help without accessing the database.
`;

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
  if (
    typeof value !== "string" ||
    !/^\d+$/.test(value) ||
    !Number.isSafeInteger(parsed) ||
    parsed <= 0 ||
    parsed > 2_147_483_647
  ) {
    throw new Error(
      `Option --${optionName} must be a positive integer no greater than 2147483647.`
    );
  }
  return parsed;
}

export async function run(argv: string[]) {
  const args = minimist(argv, {
    // Preserve flag values so minimist cannot coerce e.g. --all=0 to true.
    string: ["profile", "year", "all", "help"],
    alias: { h: "help" },
    unknown: argument => {
      throw new Error(`Unknown argument: ${argument}. Use --help for usage.`);
    },
  });

  if (args._.length) {
    throw new Error(
      "Positional arguments are not supported. Use --help for usage."
    );
  }

  for (const option of ["all", "help"]) {
    if (args[option] !== undefined && args[option] !== "") {
      throw new Error(`Option --${option} does not accept a value.`);
    }
  }

  if (!argv.length || args.help !== undefined) {
    console.log(usage);
    return;
  }

  const profileId = parseIntegerOption(args.profile, "profile");
  const year = parseIntegerOption(args.year, "year");

  const all = args.all !== undefined;
  if (all && (profileId !== undefined || year !== undefined)) {
    throw new Error(
      "Option --all cannot be combined with --profile or --year."
    );
  }
  if (!all && profileId === undefined && year === undefined) {
    throw new Error(
      "Specify --all, --profile or --year. Use --help for usage."
    );
  }

  const { db, dbDestroy } = await import("../db");

  try {
    const { rebuildAccountingSummaries } = await import(
      "../worker/import/accounting-summaries"
    );
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
  } finally {
    await dbDestroy();
  }
}

if (require.main === module) {
  run(process.argv.slice(2)).catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
