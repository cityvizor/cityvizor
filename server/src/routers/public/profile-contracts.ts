import express, { Request } from "express";

import { db, sort2order } from "../../db";
import { ContractRecord } from "../../schema";
import { parseAndLimitNumber } from "../../utils";

const router = express.Router({ mergeParams: true });

export const ProfileContractsRouter = router;

router.get("/", async (req: Request<{ profile: string }>, res) => {
  const limit = parseAndLimitNumber(req.query.limit, 100);

  const contracts = await db<ContractRecord>("contracts")
    .where("profile_id", req.params.profile)
    .limit(limit)
    .offset(Number(req.query.offset || 0))
    .modify(function () {
      if (req.query.sort) {
        const parsedOrder = sort2order(String(req.query.sort));
        if (parsedOrder) {
          this.orderBy(parsedOrder);
        }
      }
    });

  res.json(contracts);
});
