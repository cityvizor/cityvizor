import express from 'express';
import acl from "express-dynacl";

import { db } from "../db";
import { DashboardRecord } from 'src/schema';

export const router = express.Router({ mergeParams: true });

router.get("/", acl("profile-dashboard", "read"), async (req, res, next) => {

	const dashboard = await db<DashboardRecord>("dashboard")
		.select("year","category","amount","budgetAmount")
		.where({ profile_id: req.params.profile })		

	res.json(dashboard);
});