import express, {Request} from 'express';
import {db} from '../../db';
import {NoticeboardRecord} from '../../schema/database/noticeboard';

const router = express.Router({mergeParams: true});

export const ProfileNoticeboardRouter = router;

router.get('/', async (req: Request<{profile: string}>, res) => {
  const noticeBoard = await db<NoticeboardRecord>('noticeboards').where(
    'profileId',
    req.params.profile
  );

  res.json(noticeBoard);
});
