import express from "express";

const router = express.Router();

export const Routers = router;

import { PublicRouter } from "./public";
import { SearchRouter } from "./search";
import { StaticRouter } from "./static";
import { ImportRouter } from "./import";
import { AdminRouter } from "./admin";
import { AccountRouter } from "./account";

router.use("/api/account", AccountRouter);

router.use("/api/admin", AdminRouter);

router.use("/api/public", PublicRouter);

router.use("/api/import", ImportRouter)

router.use("/api/search", SearchRouter);

router.use(StaticRouter);