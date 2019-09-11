import express from "express";

import { AdminProfileYearsRouter } from "./profile-years";
import { AdminProfilesRouter } from "./profiles";
import { AdminUsersRouter } from "./users";
import { AdminProfileImportTokenRouter } from "./profile-import-token";
import { AdminProfileImportsRouter } from "./profile-imports";

const router = express.Router();

export const AdminRouter = router;

/* PROFILES */
router.use("/profiles", AdminProfilesRouter);

router.use("/profiles/:profile/years", AdminProfileYearsRouter);

router.use("/profiles/:profile/import-token", AdminProfileImportTokenRouter)

router.use("/profiles/:profile/imports", AdminProfileImportsRouter)



/* USERS */
router.use("/users", AdminUsersRouter);

router.use("**", (req, res) => res.sendStatus(404));
