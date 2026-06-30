import express, { Request } from "express";

import { db } from "../../db";
import { PlanRecord } from "../../schema";

const router = express.Router({ mergeParams: true });

export const ProfilePlansRouter = router;

/**
 * @swagger
 * /api/public/profiles/{profile}/plans:
 *   get:
 *     summary: List profile plans
 *     tags:
 *       - Public profile plans
 *     parameters:
 *       - in: path
 *         name: profile
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Profile plans.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/", async (req: Request<{ profile: string }>, res) => {
  const years = await db<PlanRecord>("pbo_plans")
    .select("year", "profileId")
    .sum({ incomeAmount: "incomeAmount" })
    .sum({ expenditureAmount: "expenditureAmount" })
    .sum({ budgetIncomeAmount: "budgetIncomeAmount" })
    .sum({ budgetExpenditureAmount: "budgetExpenditureAmount" })
    .where("profile_id", req.params.profile)
    .groupBy("year", "profileId");

  res.json(years);
});

/**
 * @swagger
 * /api/public/profiles/{profile}/plans/{year}:
 *   get:
 *     summary: Get profile plan
 *     tags:
 *       - Public profile plans
 *     parameters:
 *       - in: path
 *         name: profile
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Profile plan records.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get(
  "/:year",
  async (req: Request<{ profile: string; year: string }>, res) => {
    const accounting = await db<PlanRecord>("pbo_plans")
      .where("profileId", req.params.profile)
      .andWhere("year", req.params.year);

    res.json(accounting);
  }
);

/**
 * @swagger
 * /api/public/profiles/{profile}/plans/{year}/groups/{field}:
 *   get:
 *     summary: List profile plan groups
 *     tags:
 *       - Public profile plans
 *     parameters:
 *       - in: path
 *         name: profile
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: field
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - incomes
 *             - expenditures
 *     responses:
 *       200:
 *         description: Plan groups.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Invalid field.
 */
router.get(
  "/:year/groups/:field",
  async (
    req: Request<{ profile: string; field: string; year: string }>,
    res
  ) => {
    const field = req.params.field;

    if (["incomes", "expenditures"].indexOf(field) === -1)
      return res
        .status(400)
        .send("Parameter field can only have values incomes or expenditures.");

    const groups = await db<PlanRecord>("pbo_plans")
      .select(db.raw("SUBSTRING(sa::varchar, 1, 2) AS id"))
      .sum("incomeAmount as incomeAmount")
      .sum("budgetIncomeAmount as budgetIncomeAmount")
      .sum("expenditureAmount as expenditureAmount")
      .sum("budgetExpenditureAmount as budgetExpenditureAmount")
      .where("profileId", req.params.profile)
      .andWhere("year", req.params.year)
      .andWhereBetween("sa", field === "expenditures" ? [500, 599] : [600, 699])
      .groupBy("id");

    return res.json(groups);
  }
);

/**
 * @swagger
 * /api/public/profiles/{profile}/plans/{year}/groups/{group}/details:
 *   get:
 *     summary: List profile plan group details
 *     tags:
 *       - Public profile plans
 *     parameters:
 *       - in: path
 *         name: profile
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: group
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Plan group details.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Invalid group.
 */
router.get(
  "/:year/groups/:group/details",
  async (
    req: Request<{ profile: string; group: string; year: string }>,
    res
  ) => {
    const group = Number(req.params.group);
    if (isNaN(group))
      return res.status(400).send("Parameter group must be a number");

    const details = await db("pbo_plans as p")
      .select("p.sa as sa")
      .select("p.aa as aa")
      .select("p.sa as id")
      .sum("incomeAmount as incomeAmount")
      .sum("budgetIncomeAmount as budgetIncomeAmount")
      .sum("expenditureAmount as expenditureAmount")
      .sum("budgetExpenditureAmount as budgetExpenditureAmount")
      .where("profileId", req.params.profile)
      .andWhere("year", req.params.year)
      .whereRaw("SUBSTRING(p.sa::varchar, 1, 2) = ?", [group])
      .groupBy("sa")
      .groupBy("aa")
      .orderBy("aa");

    const aaNames = await db("data.pbo_aa_names as names")
      .select("aa")
      .select("sa")
      .select("name")
      .where("profileId", req.params.profile)
      .andWhere("year", req.params.year);

    const aas = [
      ...new Set(
        details.map(detail => {
          return {
            aa: detail.aa,
            sa: detail.sa,
          };
        })
      ),
    ];

    return res.json(
      aas.map(({ aa, sa }) => {
        const items = details.filter(
          detail => detail.aa === aa && detail.sa === sa
        );
        return {
          name:
            aaNames.find(n => n.aa === aa && n.sa === sa)?.name ||
            `Analytický účet č. ${aa} (SÚ: ${sa})`,
          id: `${aa}${sa}`,
          sa,
          items,
          incomeAmount: items.reduce(
            (acc, detail) => (acc += detail.incomeAmount),
            0
          ),
          budgetIncomeAmount: items.reduce(
            (acc, detail) => (acc += detail.budgetIncomeAmount),
            0
          ),
          expenditureAmount: items.reduce(
            (acc, detail) => (acc += detail.expenditureAmount),
            0
          ),
          budgetExpenditureAmount: items.reduce(
            (acc, detail) => (acc += detail.budgetExpenditureAmount),
            0
          ),
        };
      })
    );
  }
);
