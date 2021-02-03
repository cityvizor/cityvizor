import express from 'express';
import config = require('../config');
export const StaticRouter = express.Router();

StaticRouter.use(express.static(config.default.static.dir));

StaticRouter.get('**', (req, res) => {
  res.sendStatus(404);
});
