import express from "express";

import { ExportProfilesRouter } from "./profiles";

const router = express.Router();

export const ExportsRouter = router;

router.use("/profiles", ExportProfilesRouter);