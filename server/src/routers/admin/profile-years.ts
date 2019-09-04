import express from "express";
import { db } from "../../db";
import { YearRecord } from "../../schema";

const router = express.Router({ mergeParams: true });

export const AdminProfileYearsRouter = router;

router.get("/", async (req, res, next) => {

  const years = await db<YearRecord[]>("app.years").where({ profileId: req.params.profile });

  res.json(years);

});


router.put("/:year", async (req, res, next) => {
  var data = { profile_id: req.params.profile, year: req.params.year };

  try{
    await db("app.years").insert(data);
  }
  catch(err) {
    const existingYear = await db("app.years").where(data).first();
    if(existingYear) return res.status(200).send("Year already exists.");
  }

  res.sendStatus(201);
});


router.patch("/:year", async (req, res, next) => {

  await db<YearRecord>("app.years")
    .where({ profile_id: req.params.profile, year: Number(req.params.year) })
    .update(req.body);

  res.sendStatus(204);

});

router.delete("/:year", async (req, res, next) => {

  await db<YearRecord>("app.years")
    .where({ profile_id: req.params.profile, year: Number(req.params.year) })
    .delete();

  res.sendStatus(204);

});
