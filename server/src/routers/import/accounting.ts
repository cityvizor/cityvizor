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
import { isPositiveInteger } from "../../utils";
import { logger } from "../../logger";
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
    return processCsvImport(req, res, FileType.PAYMENTS_FILE, false);
  }
);

router.patch(
  "/profiles/:profile/payments",
  upload.fields([{ name: "payments" }]),
  schema.validate(importAccountingSchema),
  acl("profile-accounting:write"),
  async (req, res) => {
    return processCsvImport(req, res, FileType.PAYMENTS_FILE, true);
  }
);

router.post(
  "/profiles/:profile/events",
  upload.fields([{ name: "events" }]),
  schema.validate(importAccountingSchema),
  acl("profile-accounting:write"),
  async (req, res) => {
    return processCsvImport(req, res, FileType.EVENTS_FILE, false);
  }
);

router.patch(
  "/profiles/:profile/events",
  upload.fields([{ name: "events" }]),
  schema.validate(importAccountingSchema),
  acl("profile-accounting:write"),
  async (req, res) => {
    return processCsvImport(req, res, FileType.EVENTS_FILE, true);
  }
);

router.post(
  "/profiles/:profile/data",
  upload.fields([{ name: "data" }]),
  schema.validate(importAccountingSchema),
  acl("profile-accounting:write"),
  async (req, res) => {
    return processCsvImport(req, res, FileType.DATA_FILE, false);
  }
);

router.patch(
  "/profiles/:profile/data",
  upload.fields([{ name: "data" }]),
  schema.validate(importAccountingSchema),
  acl("profile-accounting:write"),
  async (req, res) => {
    return processCsvImport(req, res, FileType.DATA_FILE, true);
  }
);

router.post(
  "/profiles/:profile/plans/expected",
  upload.fields([{ name: "expectedPlan" }]),
  schema.validate(importAccountingSchema),
  acl("profile-accounting:write"),
  async (req, res) => {
    return processCsvImport(req, res, FileType.EXPECTED_PLAN_FILE, false);
  }
);

router.post(
  "/profiles/:profile/plans/real",
  upload.fields([{ name: "realPlan" }]),
  schema.validate(importAccountingSchema),
  acl("profile-accounting:write"),
  async (req, res) => {
    return processCsvImport(req, res, FileType.REAL_PLAN_FILE, false);
  }
);

router.patch(
  "/profiles/:profile/plans/expected",
  upload.fields([{ name: "expectedPlan" }]),
  schema.validate(importAccountingSchema),
  acl("profile-accounting:write"),
  async (req, res) => {
    return processCsvImport(req, res, FileType.EXPECTED_PLAN_FILE, true);
  }
);

router.patch(
  "/profiles/:profile/plans/real",
  upload.fields([{ name: "realPlan" }]),
  schema.validate(importAccountingSchema),
  acl("profile-accounting:write"),
  async (req, res) => {
    return processCsvImport(req, res, FileType.REAL_PLAN_FILE, true);
  }
);
router.post(
  "/profiles/:profile/aa/names",
  upload.fields([{ name: "aaNames" }]),
  schema.validate(importAccountingSchema),
  acl("profile-accounting:write"),
  async (req, res) => {
    return processCsvImport(req, res, FileType.AA_NAMES_FILE, false);
  }
);

router.patch(
  "/profiles/:profile/plans/real",
  upload.fields([{ name: "aaNames" }]),
  schema.validate(importAccountingSchema),
  acl("profile-accounting:write"),
  async (req, res) => {
    return processCsvImport(req, res, FileType.AA_NAMES_FILE, true);
  }
);

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
    logger.info(`Processing accounting import for profile '${req.params?.profile}' and year '${req.body?.year}'.`);

    const profileId = Number(req.params.profile);
    const isAuthorized = await checkToken(profileId, req.user?.tokenCode);

    if (!isAuthorized) {
      return res.status(403).send("Invalid token.");
    }

    const reqFiles = req.files as Record<string, Express.Multer.File[]>;

    // When both files missing throw error immediately
    if (!reqFiles || (!reqFiles.accounting && !reqFiles.zipFile)) {
      return res.status(400).send("Missing data file or zip file.");
    }
    if (!isPositiveInteger(req.body.year)) {
      return res.status(400).send("Invalid year value.");
    }

    const year = Number(req.body.year);
    const yearRecord = await ensureYearExists(profileId, year);
    const importDir = await Import.createImportDir();

    // If ZIP file has been upload it, extract it to the import directory
    // Otherwise move the CSV file to the import directory
    if (reqFiles.zipFile && reqFiles.zipFile[0]) {
      await extractZip(reqFiles.zipFile[0].path, importDir);
    } else {
      if (reqFiles.accounting && reqFiles.accounting[0])
        await move(
          reqFiles.accounting[0].path,
          path.join(importDir, "accounting.csv")
        );
    }

    const importDataFull = await createImportJob(
      "cityvizor",
      importDir,
      yearRecord,
      false,
      req.body.validity,
      req.user?.id
    );

    return res.json(importDataFull);
  }
);

router.post(
  "/profiles/:profile/subprofiles/plans/real",
  upload.fields([{ name: "zipFile", maxCount: 1 }]),
  schema.validate(importAccountingSchema),
  acl("profile-accounting:write"),
  async (req, res) => {
    logger.info(`Processing subprofile real plan import for profile '${req.params?.profile}' and year '${req.body?.year}'.`);

    const profileId = Number(req.params.profile);
    const isAuthorized = await checkToken(profileId, req.user?.tokenCode);

    if (!isAuthorized) {
      return res.status(403).send("Invalid token.");
    }

    const reqFiles = req.files as Record<string, Express.Multer.File[]>;

    if (!reqFiles || !reqFiles.zipFile) {
      return res.status(400).send("Missing zip file.");
    }

    if (!isPositiveInteger(req.body.year)) {
      return res.status(400).send("Invalid year value.");
    }

    const year = Number(req.body.year);
    const zipFileName = reqFiles.zipFile[0].filename;

    const ico = zipFileName.split("_")[1].slice(2);

    if (!ico.match(/^\d{8}$/)) {
      logger.error(`Invalid subprofile ZIP file name '${zipFileName}'`);
      return res.status(400).send("Invalid subprofile ZIP file name.");
    }

    // Find profile with the provided ICO
    // Beware! If there are multiple profiles with the same ICO, the first is selected and the rest is ignored
    const subprofileId = await db<ProfileRecord>("app.profiles")
      .select("id")
      .where({ ico: ico })
      .first()
      .then(result => result?.id);

    if (!subprofileId) {
      logger.warn(`No profile exists for subprofile import with ICO '${ico}'.`);
      return res.status(404).send("No profile exists for the provided ICO.");
    }

    const yearRecord = await ensureYearExists(subprofileId, year);
    const importDir = await Import.createImportDir();

    // Unzip subprofile ZIP file to subprofile import directory
    await extractZip(reqFiles.zipFile[0].path, importDir);

    await createImportJob(
      "pbo_real_plan",
      importDir,
      yearRecord,
      false,
      req.body.validity,
      req.user?.id
    );

    return res.sendStatus(200);
  }
);

async function processCsvImport(
  req,
  res,
  fileType: FileType,
  isAppend: boolean
) {
  logger.info(`Processing CSV import for profile '${req.params?.profile}' and year '${req.body?.year}'.`);

  // When file missing throw error immediately
  if (!req.files || !req.files[fileType.toString()]) {
    return res.status(400).send("Missing data file or zip file");
  }

  if (!isPositiveInteger(req.body.year)) {
    return res.status(400).send("Invalid year value.");
  }

  const profileId = Number(req.params.profile);
  const year = Number(req.body.year);
  const isAuthorized = await checkToken(profileId, req.user?.tokenCode);

  if (!isAuthorized) {
    return res.status(403).send("Invalid token.");
  }

  const yearRecord = await ensureYearExists(profileId, year);
  const importDir = await Import.createImportDir();

  // Move the CSV file to the import directory
  if (req.files[fileType.toString()] && req.files[fileType.toString()][0]) {
    await move(
      req.files[fileType.toString()][0].path,
      path.join(importDir, `${fileType.toString()}.csv`)
    );
  }

  const importDataFull = await createImportJob(
    importFormats[fileType],
    importDir,
    yearRecord,
    isAppend,
    req.body.validity,
    req.user?.id
  );

  res.json(importDataFull);
}

async function checkToken(
  profileId: number,
  tokenCode?: number
): Promise<boolean> {
  if (tokenCode == undefined) {
    // If the request got past the ACL without a token,
    // then it is from an authorized use (admin or profile-admin).
    return true;
  }

  const profile = await db<ProfileRecord>("app.profiles")
    .select("id", "tokenCode")
    .where("id", profileId)
    .first();

  return profile != undefined && tokenCode === profile.tokenCode;
}

async function ensureYearExists(
  profileId: number,
  yearParam: number
): Promise<YearRecord> {
  let year = await db<YearRecord>("app.years")
    .where({ profileId: profileId, year: yearParam })
    .first();

  year ??= await db<YearRecord>("app.years")
    .insert(
      {
        profileId: profileId,
        year: yearParam,
      },
      ["profileId", "year", "validity"]
    )
    .then(result => result[0]);

  if (!year) {
    throw new Error("Failed to create accounting year in database.");
  }

  return year;
}

async function createImportJob(
  format: Import.Format,
  importDir: string,
  year: YearRecord,
  isAppend: boolean,
  validity?: string,
  userId?: number
): Promise<ImportRecord> {
  // Add import task to database queue (worker checks the table)
  const importData: Partial<ImportRecord> = {
    profileId: year.profileId,
    year: year.year,
    userId: userId,
    created: DateTime.local().toJSDate(),
    status: "pending",
    error: undefined,
    validity: validity,
    format: format,
    append: isAppend,
    importDir,
  };

  const importId = await db<ImportRecord>("app.imports")
    .insert(importData, ["id"])
    .then(result => result[0]?.id);

  const importRecord = await db<ImportRecord>("app.imports")
    .where({ id: importId })
    .first();

  if (!importRecord) {
    throw new Error("Failed to create import record in database.");
  }

  return importRecord;
}

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
