import express from 'express';
import acl from "express-dynacl";
import { db } from '../db';
import { NoticeboardRecord } from '../schema/database/noticeboard';

export const router = express.Router({ mergeParams: true });

router.get("/", acl("profile-noticeboard", "read"), async (req, res, next) => {

	const noticeBoard = await db<NoticeboardRecord>("noticeboards")
		.where({ profileId: req.params.profile });

	res.json(noticeBoard);
	
});