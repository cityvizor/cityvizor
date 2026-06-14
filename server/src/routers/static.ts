import express from "express";
import config from "../config";
export const StaticRouter = express.Router();

StaticRouter.use(express.static(config.static.dir));

StaticRouter.get("**", (req, res) => {
  res.sendStatus(404);
});
