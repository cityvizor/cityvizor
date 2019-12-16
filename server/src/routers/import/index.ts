import express from 'express';

import { ImportAccountingRouter } from './accounting';

const router = express.Router();

export const ImportRouter = router;

router.use(ImportAccountingRouter);