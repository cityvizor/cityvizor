import express from 'express';

import config from '../../config';

import path from 'path';

import {db} from '../../db';
import {ProfileRecord} from '../../schema';
import * as fs from 'fs';
import {getS3AvatarPublicObjectPath} from '../../s3storage';

const router = express.Router();

export const ProfilesRouter = router;

router.get('/', async (req, res) => {
  const profiles = await db<ProfileRecord>('profiles').modify(function () {
    if (req.query.status) {
      const status = req.query.status.toString().split(',');
      this.where('status', '=', status[0]);
      status.splice(1).map(stat => this.orWhere('status', '=', stat));
    }
  });

  res.json(profiles);
});

router.get('/main', async (req, res) => {
  const profile = await db<ProfileRecord>('profiles')
    .where({main: true})
    .first();

  if (!profile) return res.sendStatus(404);
  return res.json(profile);
});

router.get('/:profile', async (req, res) => {
  const profile = await db<ProfileRecord>('profiles')
    .modify(function () {
      this.where('url', String(req.params.profile));
      if (!isNaN(Number(req.params.profile)))
        this.orWhere({id: Number(req.params.profile)});
    })
    .first();

  if (!profile) return res.sendStatus(404);
  return res.json(profile);
});

router.get('/:profile/avatar', async (req, res) => {
  const profile = await db<ProfileRecord>('profiles')
    .where('id', Number(req.params.profile))
    .first();

  if (!profile) {
    return res.sendStatus(404);
  }

  if (config.s3.enabled) {
    return res.redirect(
      getS3AvatarPublicObjectPath(profile.id, profile.avatarType, true)
    );
  }

  const avatarPath = path.join(
    config.storage.avatars,
    'avatar_' + req.params.profile + profile.avatarType
  );

  if (!fs.existsSync(avatarPath)) {
    return res.sendStatus(404);
  }

  return res.sendFile(avatarPath);
});
