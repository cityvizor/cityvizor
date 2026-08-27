import express, { Request } from "express";

import { db } from "../../db";

const router = express.Router({ mergeParams: true });

export const ProfileDashboardRouter = router;

const categoriesDef = [
  { name: "transportation", minParagraph: 2200, maxParagraph: 2299 },
  { name: "schools", minParagraph: 3100, maxParagraph: 3299 },
  { name: "housing", minParagraph: 3600, maxParagraph: 3699 },
  { name: "culture", minParagraph: 3300, maxParagraph: 3399 },
  { name: "sports", minParagraph: 3400, maxParagraph: 3499 },
  { name: "government", minParagraph: 6100, maxParagraph: 6199 },
];

const categoriesQuery = () =>
  db.unionAll(
    categoriesDef.map(category =>
      db.select(
        db.raw("? AS category", [category.name]),
        db.raw("?::integer AS min_paragraph", [category.minParagraph]),
        db.raw("?::integer AS max_paragraph", [category.maxParagraph])
      )
    )
  );

export const createProfileDashboardQuery = (profileId: string) => {
  const categoryAmounts = db("data.accounting AS a")
    .join(categoriesQuery().as("c"), function () {
      this.on("a.paragraph", ">=", "c.minParagraph").andOn(
        "a.paragraph",
        "<=",
        "c.maxParagraph"
      );
    })
    .select("a.profileId", "a.year", "c.category")
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
    .groupBy("a.profileId", "a.year", "c.category");

  return db("years AS y")
    .crossJoin(categoriesQuery().as("n"), {})
    .leftJoin(categoryAmounts.as("a"), {
      "a.year": "y.year",
      "a.category": "n.category",
      "a.profileId": "y.profileId",
    })
    .select("y.year", "n.category", "a.amount", "a.budgetAmount")
    .where({ "y.profileId": profileId });
};

router.get("/", async (req: Request<{ profile: string }>, res) => {
  res.send(await createProfileDashboardQuery(req.params.profile));
});
