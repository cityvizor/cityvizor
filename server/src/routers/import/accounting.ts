import express from "express";

import path from "path";
import multer from "multer";
import acl from "express-dynacl";
import schema from "express-jsonschema";

import extract from "extract-zip";
import fs from "fs-extra";

import config from "../../config";

import { db } from "../../db";
import { YearRecord, ProfileRecord } from "../../schema";
import { ImportRecord } from "../../schema/database/import";
import { move } from "fs-extra";
import { DateTime } from "luxon";
import { Import } from "../../worker/import/import";
const router = express.Router();

export const ImportAccountingRouter = router;

const importAccountingSchema = {
  body: {
    type: "object",
    properties: {
      year: { type: "string" },
      validity: { type: "string", format: "date" },
    },
    required: ["year"],
    additionalProperties: false,
  },
};

enum FileType {
  DATA_FILE = "data",
  PAYMENTS_FILE = "payments",
  EVENTS_FILE = "events",
  ACCOUNTING_FILE = "accounting",
  EXPECTED_PLAN_FILE = "expectedPlan",
  REAL_PLAN_FILE = "realPlan",
  AA_NAMES_FILE = "aaNames",
}

const importFormats: { [key in FileType]: Import.Format } = {
  data: "cityvizor",
  payments: "cityvizor",
  accounting: "cityvizor",
  events: "cityvizor",
  expectedPlan: "pbo_expected_plan",
  realPlan: "pbo_real_plan",
  aaNames: "pbo_aa_names",
};

const upload = multer({ dest: config.storage.tmp });

// POST requests overwrite the current data.
// PATCH requests append the new data to the existing data.

router.post(
  "/profiles/:profile/payments",
  upload.fields([{ name: "payments" }]),
  schema.validate(importAccountingSchema),
  acl("profile-accounting:write"),
  async (req, res) => {
    return createWorkerTask(req, res, FileType.PAYMENTS_FILE, false);
  }
);

router.patch(
  "/profiles/:profile/payments",
  upload.fields([{ name: "payments" }]),
  schema.validate(importAccountingSchema),
  acl("profile-accounting:write"),
  async (req, res) => {
    return createWorkerTask(req, res, FileType.PAYMENTS_FILE, true);
  }
);

router.post(
  "/profiles/:profile/events",
  upload.fields([{ name: "events" }]),
  schema.validate(importAccountingSchema),
  acl("profile-accounting:write"),
  async (req, res) => {
    return createWorkerTask(req, res, FileType.EVENTS_FILE, false);
  }
);

router.patch(
  "/profiles/:profile/events",
  upload.fields([{ name: "events" }]),
  schema.validate(importAccountingSchema),
  acl("profile-accounting:write"),
  async (req, res) => {
    return createWorkerTask(req, res, FileType.EVENTS_FILE, true);
  }
);

router.post(
  "/profiles/:profile/data",
  upload.fields([{ name: "data" }]),
  schema.validate(importAccountingSchema),
  acl("profile-accounting:write"),
  async (req, res) => {
    return createWorkerTask(req, res, FileType.DATA_FILE, false);
  }
);

router.patch(
  "/profiles/:profile/data",
  upload.fields([{ name: "data" }]),
  schema.validate(importAccountingSchema),
  acl("profile-accounting:write"),
  async (req, res) => {
    return createWorkerTask(req, res, FileType.DATA_FILE, true);
  }
);

router.post(
  "/profiles/:profile/plans/expected",
  upload.fields([{ name: "expectedPlan" }]),
  schema.validate(importAccountingSchema),
  acl("profile-accounting:write"),
  async (req, res) => {
    return createWorkerTask(req, res, FileType.EXPECTED_PLAN_FILE, false);
  }
);

router.post(
  "/profiles/:profile/plans/real",
  upload.fields([{ name: "realPlan" }]),
  schema.validate(importAccountingSchema),
  acl("profile-accounting:write"),
  async (req, res) => {
    return createWorkerTask(req, res, FileType.REAL_PLAN_FILE, false);
  }
);

router.patch(
  "/profiles/:profile/plans/expected",
  upload.fields([{ name: "expectedPlan" }]),
  schema.validate(importAccountingSchema),
  acl("profile-accounting:write"),
  async (req, res) => {
    return createWorkerTask(req, res, FileType.EXPECTED_PLAN_FILE, true);
  }
);

router.patch(
  "/profiles/:profile/plans/real",
  upload.fields([{ name: "realPlan" }]),
  schema.validate(importAccountingSchema),
  acl("profile-accounting:write"),
  async (req, res) => {
    return createWorkerTask(req, res, FileType.REAL_PLAN_FILE, true);
  }
);
router.post(
  "/profiles/:profile/aa/names",
  upload.fields([{ name: "aaNames" }]),
  schema.validate(importAccountingSchema),
  acl("profile-accounting:write"),
  async (req, res) => {
    return createWorkerTask(req, res, FileType.AA_NAMES_FILE, false);
  }
);

router.patch(
  "/profiles/:profile/plans/real",
  upload.fields([{ name: "aaNames" }]),
  schema.validate(importAccountingSchema),
  acl("profile-accounting:write"),
  async (req, res) => {
    return createWorkerTask(req, res, FileType.AA_NAMES_FILE, true);
  }
);
async function createWorkerTask(
  req,
  res,
  fileType: FileType,
  isAppend: boolean
) {
  // When file missing throw error immediately
  if (!req.files || !req.files[fileType.toString()])
    return res.status(400).send("Missing data file or zip file");
  if (isNaN(req.body.year)) return res.status(400).send("Invalid year value");

  // check if tokenCode in profile is same as in token. if not, the token has been revoked (revoke all current tokens by changing the code)
  const profile = await db<ProfileRecord>("app.profiles")
    .select("id", "tokenCode")
    .where({ id: req.params.profile })
    .first();
  if (
    !profile ||
    (req.user.tokenCode && req.user.tokenCode !== profile.tokenCode)
  )
    return res.status(403).send("Token revoked.");

  // check if imported year is created, if not create a new hidden year
  let year: YearRecord | undefined = await db<YearRecord>("app.years")
    .where({ profileId: req.params.profile, year: req.body.year })
    .first();

  if (!year) {
    const yearInsert: YearRecord = await db<YearRecord>("app.years")
      .insert(
        {
          profileId: Number(req.params.profile),
          year: req.body.year,
        },
        ["profileId", "year"]
      )
      .then();
    year = yearInsert ? yearInsert[0] : null;
    if (!year)
      return res
        .status(500)
        .send("Failed to create new accounting year in database.");
  }

  const importDir = await Import.createImportDir();

  if (req.files[fileType.toString()] && req.files[fileType.toString()][0]) {
    await move(
      req.files[fileType.toString()][0].path,
      path.join(importDir, `${fileType.toString()}.csv`)
    );
  }
  // add import task to database queue (worker checks the table)
  const importData: Partial<ImportRecord> = {
    profileId: year.profileId,
    year: year.year,

    userId: req.user ? req.user.id : undefined,

    created: DateTime.local().toJSDate(),

    status: "pending",
    error: undefined,

    validity: req.body.validity || undefined,
    format: importFormats[fileType],
    append: isAppend,
    importDir,
  };

  const result = await db<ImportRecord>("app.imports").insert(importData, [
    "id",
  ]);
  const importId = result ? result[0].id : null;

  if (!importId)
    return res.status(500).send("Failed to create import record in database.");

  // get the current full task info (including default values etc.) and return it to the client
  const importDataFull = await db<ImportRecord>("app.imports")
    .where({ id: importId })
    .first();

  res.json(importDataFull);
}

// Technical debt for historial reasons to not break backwards compatibility.
// TODO: Properly refactor this one day. Keeping this code to enable upload via ZIP.
// Ginis imports the data using the .zip functionality via ODT module
router.post(
  "/profiles/:profile/accounting",
  upload.fields([
    { name: "accounting", maxCount: 1 },
    { name: "zipFile", maxCount: 1 },
  ]),
  schema.validate(importAccountingSchema),
  acl("profile-accounting:write"),
  async (req, res) => {
    const reqFiles = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    // When both files missing throw error immediately
    if (!reqFiles || (!reqFiles.accounting && !reqFiles.zipFile)) {
      return res.status(400).send("Missing data file or zip file");
    }
    if (isNaN(req.body.year)) {
      return res.status(400).send("Invalid year value");
    }

    // check if tokenCode in profile is same as in token. if not, the token has been revoked (revoke all current tokens by changing the code)
    const profile = await db<ProfileRecord>("app.profiles")
      .select("id", "tokenCode")
      .where("id", req.params.profile)
      .first();

    if (
      !profile ||
      (req.user.tokenCode && req.user.tokenCode !== profile.tokenCode)
    )
      return res.status(403).send("Token revoked.");

    // check if imported year is created, if not create a new hidden year
    let year: YearRecord | undefined = await db<YearRecord>("app.years")
      .where("profileId", req.params.profile)
      .andWhere("year", req.body.year)
      .first();

    if (!year) {
      const yearInsert: YearRecord = await db<YearRecord>("app.years")
        .insert(
          {
            profileId: Number(req.params.profile),
            year: req.body.year,
          },
          ["profileId", "year"]
        )
        .then();
      year = yearInsert ? yearInsert[0] : null;
      if (!year)
        return res
          .status(500)
          .send("Failed to create new accounting year in database.");
    }

    const importDir = await Import.createImportDir();

    if (reqFiles.zipFile && reqFiles.zipFile[0]) {
      await extractZip(reqFiles.zipFile[0].path, importDir);
    } else {
      if (reqFiles.accounting && reqFiles.accounting[0])
        await move(
          reqFiles.accounting[0].path,
          path.join(importDir, "accounting.csv")
        );
    }

    // add import task to database queue (worker checks the table)
    const importData: Partial<ImportRecord> = {
      profileId: year.profileId,
      year: year.year,

      userId: req.user ? req.user.id : undefined,

      created: DateTime.local().toJSDate(),

      status: "pending",
      error: undefined,

      validity: req.body.validity || undefined,
      format: "cityvizor",
      append: false,
      importDir,
    };

    const result = await db<ImportRecord>("app.imports").insert(importData, [
      "id",
    ]);
    const importId = result ? result[0].id : null;

    if (!importId)
      return res
        .status(500)
        .send("Failed to create import record in database.");

    // get the current full task info (including default values etc.) and return it to the client
    const importDataFull = await db<ImportRecord>("app.imports")
      .where({ id: importId })
      .first();

    return res.json(importDataFull);
  }
);

async function extractZip(zipFile: string, unzipDir: string) {
  try {
    await extract(zipFile, { dir: unzipDir });
  } catch (err) {
    throw new Error("Unable to extract ZIP file: " + (err as Error)?.message);
  }

  const extractedFiles = await fs.readdir(unzipDir);

  return {
    dataFile: extractedFiles.filter(file => file.match(/data/i))[0],
    eventsFile: extractedFiles.filter(file => file.match(/events/i))[0],
    paymentsFile: extractedFiles.filter(file => file.match(/payments/i))[0],
  };
}
