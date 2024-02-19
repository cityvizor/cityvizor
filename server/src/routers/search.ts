import express from "express";
import acl = require("express-dynacl");

export const SearchRouter = express.Router({ mergeParams: true });

SearchRouter.post("/counterparties", acl("payments:list"), (req, res) => {
  res.sendStatus(404);
});

SearchRouter.post("/payments", acl("payments:list"), (req, res) => {
  res.sendStatus(404);
});
