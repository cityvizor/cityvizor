import express, { Request } from "express";

import { db } from "../../db";
import {
  isFeatureEnabled,
  PRECOMPUTED_ACCOUNTING_SUMMARIES_FEATURE,
} from "../../feature-flags";

const router = express.Router({ mergeParams: true });

export const ProfileDashboardRouter = router;

router.get("/", async (req: Request<{ profile: string }>, res) => {
  const categoriesDef = [
    {
      name: "transportation",
      groupIds: ["22"],
      legacyWhere: "paragraph >= 2200 AND paragraph <= 2299",
    },
    {
      name: "schools",
      groupIds: ["31", "32"],
      legacyWhere: "paragraph >= 3100 AND paragraph <= 3299",
    },
    {
      name: "housing",
      groupIds: ["36"],
      legacyWhere: "paragraph >= 3600 AND paragraph <= 3699",
    },
    {
      name: "culture",
      groupIds: ["33"],
      legacyWhere: "paragraph >= 3300 AND paragraph <= 3399",
    },
    {
      name: "sports",
      groupIds: ["34"],
      legacyWhere: "paragraph >= 3400 AND paragraph <= 3499",
    },
    {
      name: "government",
      groupIds: ["61"],
      legacyWhere: "paragraph >= 6100 AND paragraph <= 6199",
    },
  ];
  const usePrecomputedSummaries = await isFeatureEnabled(
    PRECOMPUTED_ACCOUNTING_SUMMARIES_FEATURE
  );

  const categoriesNames = db.unionAll(
    categoriesDef.map(category => {
      return db.raw("SELECT ? AS category", [category.name]);
    })
  );

  const categoriesAccounting = db.unionAll(
    categoriesDef.map(category => {
      if (!usePrecomputedSummaries) {
        return db("accounting")
          .select(
            "profile_id",
            "year",
            db.raw("? AS category", [category.name]),
            "expenditureAmount",
            "budgetExpenditureAmount"
          )
          .whereRaw(category.legacyWhere);
      }

      return db("data.accounting_group_summaries")
        .select(
          "profile_id",
          "year",
          db.raw("? AS category", [category.name]),
          "expenditureAmount",
          "budgetExpenditureAmount"
        )
        .where("field", "paragraph")
        .andWhere("profileId", req.params.profile)
        .whereIn("groupId", category.groupIds);
    })
  );

  const amounts = db("years AS y")
    .crossJoin(categoriesNames.as("n"), {})
    .leftJoin(categoriesAccounting.as("a"), {
      "a.year": "y.year",
      "a.category": "n.category",
      "a.profileId": "y.profileId",
    })
    .select("y.year", "n.category")
    .sum("a.expenditureAmount AS amount")
    .sum("a.budgetExpenditureAmount AS budgetAmount")
    .where({ "y.profileId": req.params.profile })
    .groupBy("y.year", "n.category");

  res.send(await amounts);
});
