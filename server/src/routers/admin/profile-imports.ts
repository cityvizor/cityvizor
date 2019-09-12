import express from "express";
import { ImportRecord } from "../../schema/database/import";
import { db } from "../../db";

const router = express.Router({ mergeParams: true });

export const AdminProfileImportsRouter = router;

router.get("/", async (req, res, next) => {

  const records = await db<ImportRecord>("app.imports").where({ profileId: req.params.profile });

  res.json(records);
});