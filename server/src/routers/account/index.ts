import express from 'express';
import {AccountLoginRouter} from './login';

const router = express.Router();

export const AccountRouter = router;

router.use('/login', AccountLoginRouter);
