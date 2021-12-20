import express from 'express';

import config from '../../config';
import multer from 'multer';
import path from 'path';
import axios from 'axios';

import * as fs from 'fs-extra';

import {db} from '../../db';
import {ProfileRecord} from '../../schema';

import acl from 'express-dynacl';
import {URL} from 'url';
import {
  getS3AvatarPublicObjectPath,
  getS3Client,
  S3uploadPublicFile,
} from '../../s3storage';

const router = express.Router();

export const AdminProfilesRouter = router;

const upload = multer({dest: config.storage.tmp});

router.get('/', acl('profiles:list'), async (req, res) => {
  const profiles = await db<ProfileRecord>('app.profiles')
    .select('id', 'status', 'name', 'url', 'gpsX', 'gpsY', 'main', 'popup_name')
    .modify(function () {
      if (req.query.status) {
        this.where('status', '=', req.query.status.toString());
      }
    });

  res.json(profiles);
});

router.post('/', acl('profiles:write'), async (req, res) => {
  const id = await db<ProfileRecord>('app.profiles')
    .insert(req.body, ['id'])
    .then(result => result[0].id);

  res.location('/profiles/' + id);

  res.sendStatus(201);
});

router.get('/:profile', acl('profiles:read'), async (req, res) => {
  const profile = await db<ProfileRecord>('app.profiles')
    .where('id', req.params.profile)
    .first();

  if (!profile) {
    return res.sendStatus(404);
  }

  profile.avatarUrl = config.s3.enabled
    ? getS3AvatarPublicObjectPath(profile.id, profile.avatarType, true)
    : config.apiRoot + '/public/profiles/' + profile.id + '/avatar';

  return res.json(profile);
});

router.patch('/:profile', acl('profiles:write'), async (req, res) => {
  await db('app.profiles').where({id: req.params.profile}).update(req.body);

  res.sendStatus(204);
});

router.get('/:profile/avatar', async (req, res) => {
  const profile = await db<ProfileRecord>('app.profiles')
    .where('id', Number(req.params.profile))
    .first();

  if (!profile) return res.sendStatus(404);

  const avatarPath = path.join(
    config.storage.avatars,
    'avatar_' + req.params.profile + profile.avatarType
  );

  if (config.s3.enabled) {
    return res.redirect(
      getS3AvatarPublicObjectPath(profile.id, profile.avatarType, true)
    );
  }

  if (!fs.existsSync(avatarPath)) {
    return res.sendStatus(404);
  }

  return res.sendFile(avatarPath);
});

router.delete('/:profile', acl('profiles:write'), async (req, res) => {
  await db('app.profiles').where({id: req.params.profile}).delete();
  res.sendStatus(204);
});

router.put(
  '/:profile/avatar',
  acl('profiles:write'),
  upload.single('avatar'),
  async (req, res) => {
    if (!req.file && !req.body.url)
      return res.status(400).send('Missing file.');

    const profile = await db<ProfileRecord>('app.profiles')
      .select('id', 'avatarType')
      .where('id', req.params.profile)
      .first();
    if (!profile) return res.sendStatus(404);

    const allowedTypes = ['.png', '.jpg', '.jpe', '.jpeg', '.gif', '.svg'];

    const extname = req.file
      ? path.extname(req.file.originalname).toLowerCase()
      : req.body.url.match(/\.(png|jpg|jpe|gif|svg)/)[0];
    if (allowedTypes.indexOf(extname) === -1)
      return res
        .status(400)
        .send('Allowed file types are: ' + allowedTypes.join(', '));
    const avatarPath = path.join(
      config.storage.avatars,
      'avatar_' + req.params.profile + extname
    );

    if (req.file) {
      if (config.s3.enabled) {
        await S3uploadPublicFile(
          getS3AvatarPublicObjectPath(profile.id, extname),
          req.file.path
        );
      } else {
        await fs.move(req.file.path, avatarPath, {
          overwrite: true,
        });
      }
    }

    if (req.body.url) {
      if (
        !config.avatarWhitelist
          .map(addr => new URL(String(addr)).host)
          .includes(new URL(req.body.url).host)
      )
        return;
      await axios.get(req.body.url, {responseType: 'stream'}).then(r => {
        r.data.pipe(fs.createWriteStream(avatarPath));
        // TODO: WTF is this piping, re-upload to S3 in case this is still used
        if (config.s3.enabled) {
          S3uploadPublicFile(
            getS3AvatarPublicObjectPath(profile.id, extname),
            avatarPath
          );
        }
      });
    }

    await db<ProfileRecord>('app.profiles')
      .where('id', req.params.profile)
      .update({avatarType: extname});

    return res.sendStatus(204);
  }
);

router.delete('/:profile/avatar', acl('profiles:write'), async (req, res) => {
  const profile = await db<ProfileRecord>('app.profiles')
    .select('id', 'avatarType')
    .where('id', req.params.profile)
    .first();
  if (!profile) return res.sendStatus(404);

  if (!profile.avatarType) return res.sendStatus(204);

  const avatarPath = path.join(
    config.storage.avatars,
    'avatar_' + profile.id + profile.avatarType
  );

  if (fs.existsSync(avatarPath)) {
    await fs.remove(avatarPath);
  }

  if (config.s3.enabled) {
    await getS3Client().removeObject(
      config.s3.public_bucket,
      getS3AvatarPublicObjectPath(profile.id, profile.avatarType),
      (error: Error | null) => {
        if (error) {
          // tslint:disable-next-line:no-console
          console.log('Delete from S3 error', error);
        }
      }
    );
  }

  await db<ProfileRecord>('app.profiles')
    .where('id', req.params.profile)
    .update({avatarType: null});

  return res.sendStatus(204);
});
