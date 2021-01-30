import express from "express";
export const StaticRouter = express.Router();

const config = require("../config").default;

StaticRouter.use(express.static(config.static.dir));

StaticRouter.get("**",(req,res) => {
  res.sendStatus(404)
});