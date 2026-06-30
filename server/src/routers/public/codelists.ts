import express from "express";

import { db } from "../../db";
import { CodelistRecord } from "../../schema";

const router = express.Router();

export const CodelistsRouter = router;

/**
 * @swagger
 * /api/public/codelists:
 *   get:
 *     summary: List codelists
 *     tags:
 *       - Public codelists
 *     responses:
 *       200:
 *         description: Codelist names.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
router.get("/", async (req, res) => {
  const codelists = await db<CodelistRecord>("codelists")
    .distinct("codelist")
    .then(rows => rows.map(row => row.codelist));
  res.json(codelists);
});

/**
 * @swagger
 * /api/public/codelists/{name}:
 *   get:
 *     summary: Get codelist items
 *     tags:
 *       - Public codelists
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Codelist items.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   validFrom:
 *                     type: string
 *                     format: date
 *                   validTill:
 *                     type: string
 *                     format: date
 *       404:
 *         description: Codelist not found.
 */
router.get("/:name", async (req, res) => {
  const codelist = await db<CodelistRecord>("codelists")
    .select("id", "name", "description", "validFrom", "validTill")
    .where({ codelist: req.params.name });

  if (codelist.length) res.json(codelist);
  else res.sendStatus(404);
});
