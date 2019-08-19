import express from 'express';
import acl from "express-dynacl";
import { db } from '../db';
import { NoticeboardRecord } from 'src/schema/noticeboard';

export const router = express.Router({ mergeParams: true });

router.get("/", acl("profile-noticeboard", "read"), async (req, res, next) => {

	const noticeBoard = await db<NoticeboardRecord>("noticeboards")
		.where({ profileId: req.parama.profile });

	res.json(noticeBoard);
	
});