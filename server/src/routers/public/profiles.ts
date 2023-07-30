import express from 'express';

import config from '../../config';

import path from 'path';

import {db} from '../../db';
import {ProfileRecord, ProfileRecordWithChildrenCount} from '../../schema';
import * as fs from 'fs';
import {getS3AvatarPublicObjectPath} from '../../s3storage';
import {userManagesProfile} from '../../config/roles';

const router = express.Router();

export const ProfilesRouter = router;

function createQueryWithStatusFilter(statuses, tableName: string){
  let query = db<ProfileRecordWithChildrenCount>('profiles AS ' + tableName)
  if(statuses){
    const columnName = tableName + '.status';
    const status = statuses.toString().split(',');
    query.where(function() {
      this.where(columnName, '=', status[0])
      status.splice(1).map(stat => this.orWhere(columnName, '=', stat));
    })
  }
  return query;
}

/*request: {
  string[] status - filtes profiles by provided statuses
  bool countChildren - if true, for each returned profile counts its children profiles
  bool orphansOnly -  only returs profiles whose parent is NULL
}*/
router.get('/', async (req, res) => {
  console.log(req.query);
  
  let query = createQueryWithStatusFilter(req.query.status, 'profile');
  
  if(req.query.countChildren){
    let innerQuery = createQueryWithStatusFilter(req.query.status, 'innerProfile')
      .select('innerProfile.id' , db.raw('COUNT(child.id) AS childrenCount'))
      .leftJoin('profiles AS child', 'innerProfile.id', 'child.parent');
    innerQuery = innerQuery
      .groupBy('innerProfile.id')
      .as('counts');

    query = query.join(innerQuery, 'profile.id', 'counts.id');
  }

  if(req.query.orphansOnly){
    query = query.whereNull('profile.parent');
  }
  const profiles = await query.orderBy('profile.id');
  res.json(profiles);
});

/*
returns children profiles of profile with specified id
request: {
  string[] status - filtes profiles by provided statuses
}*/
router.get('/:id/children', async (req, res) => {
  if(!Number(req.params.id)){
    res.sendStatus(400);
  }
  let query = createQueryWithStatusFilter(req.query.status, 'profile')
    .where('profile.parent', Number(req.params.id))
  const profiles = await query.orderBy('profile.id');
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
  const profile: ProfileRecord | null = await db<ProfileRecord>('profiles')
    .modify(function () {
      this.where('url', String(req.params.profile));
      if (!isNaN(Number(req.params.profile))) {
        this.orWhere({id: Number(req.params.profile)});
      }
    })
    .first();

  if (!profile) {
    return res.sendStatus(404);
  }

  if (profile.status === 'hidden') {
    const userRoles = req.user?.roles ?? [];
    const canAccess = userRoles.some(role => {
      return (
        role === 'admin' ||
        (role === 'profile-admin' && userManagesProfile(req.user, profile.id))
      );
    });

    if (!canAccess) {
      return res.sendStatus(404);
    }
  }

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
