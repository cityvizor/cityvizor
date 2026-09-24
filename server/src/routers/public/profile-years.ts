import express, { Request } from "express";

import { db } from "../../db";
import { YearRecord } from "../../schema";

const router = express.Router({ mergeParams: true });

export const ProfileYearsRouter = router;

const getBaseQuery = (profileId: string) =>
  db("years as y")
    .select("y.profileId", "y.year", "y.validity")
    .leftJoin("accounting as a", {
      "a.profileId": "y.profileId",
      "a.year": "y.year",
    })
    .where({ "y.profile_id": profileId })
    .groupBy("y.profileId", "y.year", "y.validity")
    .orderBy("y.year");

router.get(
  "/",
  async (req: Request<{ profile: string; year: string }>, res) => {
    const sumMode = req.query.sumMode ?? "complete";

    if (sumMode === "complete") {
      const years = await getBaseQuery(req.params.profile)
        .sum("a.expenditureAmount as expenditureAmount")
        .sum("a.budgetExpenditureAmount as budgetExpenditureAmount")
        .sum("a.incomeAmount as incomeAmount")
        .sum("a.budgetIncomeAmount as budgetIncomeAmount")
        .sum("a.financingAmount as financingAmount")
        .sum("a.budgetFinancingAmount as budgetFinancingAmount");

      return res.json(
        years.map(year => ({
          ...year,
          incomeWithoutFinancingAmount:
            (year.incomeAmount ?? 0) - (year.financingAmount ?? 0),
          budgetIncomeWithoutFinancingAmount:
            (year.budgetIncomeAmount ?? 0) - (year.budgetFinancingAmount ?? 0),
        }))
      );
    } else if (sumMode === "visible") {
      const incomeAmounts = await getBaseQuery(req.params.profile)
        .sum("a.incomeAmount as incomeAmount")
        .sum("a.budgetIncomeAmount as budgetIncomeAmount")
        .sum("a.financingAmount as visibleFinancingAmount")
        .sum("a.budgetFinancingAmount as visibleBudgetFinancingAmount")
        .innerJoin("codelists as c", {
          "c.id": db.raw("SUBSTRING(a.item::varchar, 1, 2)"),
        })
        .where({ "c.codelist": "item-groups" });

      const expenditureAmounts = await getBaseQuery(req.params.profile)
        .sum("a.expenditureAmount as expenditureAmount")
        .sum("a.budgetExpenditureAmount as budgetExpenditureAmount")
        .innerJoin("codelists as c", {
          "c.id": db.raw("SUBSTRING(a.paragraph::varchar, 1, 2)"),
        })
        .where({ "c.codelist": "paragraph-groups" });

      const financingAmounts = await getBaseQuery(req.params.profile)
        .sum("a.financingAmount as financingAmount")
        .sum("a.budgetFinancingAmount as budgetFinancingAmount");

      const expendituresByYear = new Map(
        expenditureAmounts.map(year => [year.year, year])
      );
      const financingByYear = new Map(
        financingAmounts.map(year => [year.year, year])
      );

      const years = incomeAmounts.map(year => {
        const expenditure = expendituresByYear.get(year.year);
        const financing = financingByYear.get(year.year);
        const {
          visibleFinancingAmount,
          visibleBudgetFinancingAmount,
          ...income
        } = year;

        return {
          ...income,
          incomeWithoutFinancingAmount:
            (year.incomeAmount ?? 0) - (visibleFinancingAmount ?? 0),
          budgetIncomeWithoutFinancingAmount:
            (year.budgetIncomeAmount ?? 0) -
            (visibleBudgetFinancingAmount ?? 0),
          financingAmount: financing?.financingAmount ?? 0,
          budgetFinancingAmount: financing?.budgetFinancingAmount ?? 0,
          expenditureAmount: expenditure?.expenditureAmount ?? 0,
          budgetExpenditureAmount: expenditure?.budgetExpenditureAmount ?? 0,
        };
      });

      return res.json(years);
    } else {
      return res.sendStatus(400);
    }
  }
);

router.get(
  "/:year",
  async (req: Request<{ profile: string; year: string }>, res) => {
    const year = await db<YearRecord>("years")
      .where("profile_id", req.params.profile)
      .andWhere("year", Number(req.params.year));

    res.json(year);
  }
);
