import express, { Request } from "express";

import { db } from "../../db";

const router = express.Router({ mergeParams: true });

export const ProfileDashboardRouter = router;

const categoriesDef = [
  { code: 22, name: "transportation", minParagraph: 2200, maxParagraph: 2299 },
  { code: 31, name: "schools", minParagraph: 3100, maxParagraph: 3299 },
  { code: 36, name: "housing", minParagraph: 3600, maxParagraph: 3699 },
  { code: 33, name: "culture", minParagraph: 3300, maxParagraph: 3399 },
  { code: 34, name: "sports", minParagraph: 3400, maxParagraph: 3499 },
  { code: 61, name: "government", minParagraph: 6100, maxParagraph: 6199 },
];

const categoriesQuery = () =>
  db.unionAll(
    categoriesDef.map(category =>
      db.select(
        db.raw("? AS category", [category.name]),
        db.raw("?::integer AS category_code", [category.code])
      )
    )
  );

const categoryCodeExpression = () =>
  db.raw(
    `CASE ${categoriesDef
      .map(() => "WHEN a.paragraph BETWEEN ? AND ? THEN ?::integer")
      .join(" ")} END`,
    categoriesDef.flatMap(category => [
      category.minParagraph,
      category.maxParagraph,
      category.code,
    ])
  );

export const createProfileDashboardQuery = (profileId: string) => {
  const categoryAmounts = db("data.accounting AS a")
    .select("a.profileId", "a.year", {
      categoryCode: categoryCodeExpression(),
    })
    .sum({
      amount: db.raw(`
        CASE
          WHEN (a.item >= 5000 AND a.item < 8000 OR a.item IS NULL)
            AND a.type <> 'ROZ'
          THEN a.amount
          ELSE 0
        END
      `),
      budgetAmount: db.raw(`
        CASE
          WHEN (a.item >= 5000 AND a.item < 8000 OR a.item IS NULL)
            AND a.type = 'ROZ'
          THEN a.amount
          ELSE 0
        END
      `),
    })
    .where("a.profileId", profileId)
    .groupBy("a.profileId", "a.year", "categoryCode");

  return db("years AS y")
    .crossJoin(categoriesQuery().as("n"), {})
    .leftJoin(categoryAmounts.as("a"), {
      "a.year": "y.year",
      "a.categoryCode": "n.categoryCode",
      "a.profileId": "y.profileId",
    })
    .select("y.year", "n.category", "a.amount", "a.budgetAmount")
    .where({ "y.profileId": profileId });
};

router.get("/", async (req: Request<{ profile: string }>, res) => {
  res.send(await createProfileDashboardQuery(req.params.profile));
});
