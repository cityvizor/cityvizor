import express, { Request, Response } from "express";
import acl from "express-dynacl";
import { db } from "../../db";
import { PboCategoryRecord } from "../../schema/database/pbo-category";

const router = express.Router();

export const PboCategoriesRouter = router;

// LIST
router.get("/", acl("options:read"), async (req: Request, res: Response) => {
  try {
    const data = await db<PboCategoryRecord>("app.pbo_categories");

    res.json(data ?? []);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : err });
  }
});

// READ
router.get(
  "/:id",
  acl("options:read"),
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const data = await db<PboCategoryRecord>("app.pbo_categories")
        .where("pboCategoryId", req.params.id)
        .first();

      if (data) {
        res.json(data);
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : err });
    }
  }
);

// CREATE
router.post("/", acl("options:write"), async (req: Request, res: Response) => {
  try {
    const body: PboCategoryRecord = req.body;
    const idIsValid: boolean = /^\w[\w-]{1,14}\w$/.test(body.pboCategoryId);

    if (!idIsValid) {
      res.status(400).json({ error: "Invalid 'pboCategoryId' value" });
    } else {
      const [id] = await db("app.pbo_categories").insert(body, [
        "pboCategoryId",
      ]);
      res.status(201).json(id);
    }
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : err });
  }
});

// UPDATE
router.put(
  "/:id",
  acl("options:write"),
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const body: Partial<PboCategoryRecord> = req.body;

      await db("app.pbo_categories")
        .where("pboCategoryId", req.params.id)
        .update(body);

      res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : err });
    }
  }
);

// DELETE
router.delete(
  "/:id",
  acl("options:write"),
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      await db("app.pbo_categories")
        .where({ pboCategoryId: req.params.id })
        .delete();

      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : err });
    }
  }
);
