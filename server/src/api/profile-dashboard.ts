import express from 'express';
import acl from "express-dynacl";

import { db } from "../db";
import { DashboardRecord } from 'src/schema/database';

export const router = express.Router({ mergeParams: true });

router.get("/", acl("profile-dashboard", "read"), async (req, res, next) => {


	res.json([]);
});