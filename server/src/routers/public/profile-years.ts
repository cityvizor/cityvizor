import express, { Request } from "express";

import { db } from "../../db";
import {
  AccountingSource,
  getAccountingSources,
} from "../../accounting-sources";
import { YearRecord } from "../../schema";

const router = express.Router({ mergeParams: true });

export const ProfileYearsRouter = router;

const getLegacyBaseQuery = (profileId: string, accounting: AccountingSource) =>
  db("years as y")
    .select("y.profileId", "y.year", "y.validity")
    .leftJoin(accounting().as("a"), {
      "a.profileId": "y.profileId",
      "a.year": "y.year",
    })
    .where({ "y.profileId": profileId })
    .groupBy("y.profileId", "y.year", "y.validity")
    .orderBy("y.year");

const getCompleteYears = (profileId: string, yearSummaries: AccountingSource) =>
  db("years as y")
    .select("y.profileId", "y.year", "y.validity")
    .select(
      db.raw("COALESCE(a.actual_expenditure_amount, 0) AS expenditure_amount"),
      db.raw(
        "COALESCE(a.budget_expenditure_amount, 0) AS budget_expenditure_amount"
      ),
      db.raw("COALESCE(a.actual_income_amount, 0) AS income_amount"),
      db.raw("COALESCE(a.budget_income_amount, 0) AS budget_income_amount"),
      db.raw("COALESCE(a.actual_financing_amount, 0) AS financing_amount"),
      db.raw(
        "COALESCE(a.budget_financing_amount, 0) AS budget_financing_amount"
      )
    )
    .leftJoin(yearSummaries().as("a"), {
      "a.profileId": "y.profileId",
      "a.year": "y.year",
    })
    .where({ "y.profileId": profileId })
    .orderBy("y.year");

const getVisibleAmounts = (
  profileId: string,
  field: "paragraph" | "item",
  codelist: "paragraph-groups" | "item-groups",
  groupSummaries: AccountingSource
) => {
  const amountColumns =
    field === "item"
      ? [
          ["actual_income_amount", "income_amount"],
          ["budget_income_amount", "budget_income_amount"],
          ["actual_financing_amount", "financing_amount"],
          ["budget_financing_amount", "budget_financing_amount"],
        ]
      : [
          ["actual_expenditure_amount", "expenditure_amount"],
          ["budget_expenditure_amount", "budget_expenditure_amount"],
        ];

  const query = db("years as y")
    .select("y.profileId", "y.year", "y.validity")
    .innerJoin(groupSummaries().as("a"), function () {
      this.on("a.profileId", "y.profileId")
        .andOn("a.year", "y.year")
        .andOnVal("a.field", field);
    })
    .innerJoin("codelists as c", function () {
      this.on("c.id", "a.groupId").andOnVal("c.codelist", codelist);
    })
    .where({ "y.profileId": profileId })
    .groupBy("y.profileId", "y.year", "y.validity")
    .orderBy("y.year");

  amountColumns.forEach(([column, alias]) => {
    query.select(
      db.raw("COALESCE(SUM(??) FILTER (WHERE c.id IS NOT NULL), 0) AS ??", [
        `a.${column}`,
        alias,
      ])
    );
  });

  return query;
};

router.get(
  "/",
  async (req: Request<{ profile: string; year: string }>, res) => {
    const sumMode = req.query.sumMode ?? "complete";
    const sources = await getAccountingSources(req.params.profile);
    const { usePrecomputedSummaries } = sources;

    if (sumMode === "complete") {
      if (usePrecomputedSummaries) {
        const years = await getCompleteYears(
          req.params.profile,
          sources.yearSummaries
        );

        return res.json(
          years.map(year => ({
            ...year,
            incomeWithoutFinancingAmount:
              (year.incomeAmount ?? 0) - (year.financingAmount ?? 0),
            budgetIncomeWithoutFinancingAmount:
              (year.budgetIncomeAmount ?? 0) -
              (year.budgetFinancingAmount ?? 0),
          }))
        );
      }

      const years = await getLegacyBaseQuery(
        req.params.profile,
        sources.accounting
      )
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
      if (usePrecomputedSummaries) {
        const [incomeAmounts, expenditureAmounts, completeAmounts] =
          await Promise.all([
            getVisibleAmounts(
              req.params.profile,
              "item",
              "item-groups",
              sources.groupSummaries
            ),
            getVisibleAmounts(
              req.params.profile,
              "paragraph",
              "paragraph-groups",
              sources.groupSummaries
            ),
            getCompleteYears(req.params.profile, sources.yearSummaries),
          ]);

        const expenditureByYear = new Map(
          expenditureAmounts.map(amounts => [amounts.year, amounts])
        );
        const completeByYear = new Map(
          completeAmounts.map(amounts => [amounts.year, amounts])
        );
        const years = incomeAmounts.map(income => {
          const expenditure = expenditureByYear.get(income.year);
          const complete = completeByYear.get(income.year);
          return {
            ...income,
            incomeWithoutFinancingAmount:
              (income.incomeAmount ?? 0) - (income.financingAmount ?? 0),
            budgetIncomeWithoutFinancingAmount:
              (income.budgetIncomeAmount ?? 0) -
              (income.budgetFinancingAmount ?? 0),
            financingAmount: complete?.financingAmount ?? 0,
            budgetFinancingAmount: complete?.budgetFinancingAmount ?? 0,
            expenditureAmount: expenditure?.expenditureAmount ?? 0,
            budgetExpenditureAmount: expenditure?.budgetExpenditureAmount ?? 0,
          };
        });

        return res.json(years);
      }

      const incomeAmounts = await getLegacyBaseQuery(
        req.params.profile,
        sources.accounting
      )
        .sum("a.incomeAmount as incomeAmount")
        .sum("a.budgetIncomeAmount as budgetIncomeAmount")
        .sum("a.financingAmount as visibleFinancingAmount")
        .sum("a.budgetFinancingAmount as visibleBudgetFinancingAmount")
        .innerJoin("codelists as c", {
          "c.id": db.raw("SUBSTRING(a.item::varchar, 1, 2)"),
        })
        .where({ "c.codelist": "item-groups" });

      const expenditureAmounts = await getLegacyBaseQuery(
        req.params.profile,
        sources.accounting
      )
        .sum("a.expenditureAmount as expenditureAmount")
        .sum("a.budgetExpenditureAmount as budgetExpenditureAmount")
        .innerJoin("codelists as c", {
          "c.id": db.raw("SUBSTRING(a.paragraph::varchar, 1, 2)"),
        })
        .where({ "c.codelist": "paragraph-groups" });

      const financingAmounts = await getLegacyBaseQuery(
        req.params.profile,
        sources.accounting
      )
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
