import express from "express";
import { getFeatureFlags } from "../feature-flags";

export const FeatureFlagsRouter = express.Router();

FeatureFlagsRouter.get("/", async (req, res) => {
  res.set("Cache-Control", "no-store").json(await getFeatureFlags());
});
