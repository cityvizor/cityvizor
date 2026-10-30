import express, { Request } from "express";

import { db } from "../../db";
import { getAccountingSources } from "../../accounting-sources";

const router = express.Router({ mergeParams: true });

export const ProfileDashboardRouter = router;

const categoryGroups = [
  ["transportation", "22"],
  ["schools", "31"],
  ["schools", "32"],
  ["housing", "36"],
  ["culture", "33"],
  ["sports", "34"],
  ["government", "61"],
];

router.get("/", async (req: Request<{ profile: string }>, res) => {
  const sources = await getAccountingSources(req.params.profile);
  const { usePrecomputedSummaries } = sources;

  const categoriesAccounting = (
    usePrecomputedSummaries
      ? sources.groupSummaries("a")
      : sources.accounting("a")
  )
    .join("categoryGroups AS c", function () {
      if (usePrecomputedSummaries) {
        this.on("a.groupId", "c.groupId");
      } else {
        this.on(
          db.raw(
            "a.paragraph BETWEEN c.group_id::integer * 100 AND c.group_id::integer * 100 + 99"
          )
        );
      }
    })
    .where("a.profileId", req.params.profile)
    .modify(query => {
      if (usePrecomputedSummaries) {
        query.where("a.field", "paragraph");
      } else {
        // Filtr se může promítnout dovnitř agregovaného účetního view.
        query.where(function () {
          for (const [, groupId] of categoryGroups) {
            const start = Number(groupId) * 100;
            this.orWhereBetween("a.paragraph", [start, start + 99]);
          }
        });
      }
    })
    .select("a.year", "c.category")
    .sum({
      amount: usePrecomputedSummaries
        ? "a.actualExpenditureAmount"
        : "a.expenditureAmount",
      budgetAmount: "a.budgetExpenditureAmount",
    })
    .groupBy("a.year", "c.category");

  const amounts = db
    .with(
      "categoryGroups",
      ["category", "groupId"],
      db.raw(
        `VALUES ${categoryGroups.map(() => "(?, ?)").join(", ")}`,
        categoryGroups.flat()
      )
    )
    .from("years AS y")
    // Každý veřejný rok musí obsahovat i kategorie bez účetních dat.
    .crossJoin(db("categoryGroups").distinct("category").as("n"), {})
    .leftJoin(categoriesAccounting.as("a"), {
      "a.year": "y.year",
      "a.category": "n.category",
    })
    .select("y.year", "n.category", "a.amount", "a.budgetAmount")
    .where("y.profileId", req.params.profile);

  res.send(await amounts);
});
