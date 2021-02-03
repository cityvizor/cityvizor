import express from 'express';

import bcrypt from 'bcryptjs';

import {db} from '../../db';
import {ProfileRecord, UserProfileRecord, UserRecord} from '../../schema';

import acl from 'express-dynacl';

const router = express.Router();

export const AdminUsersRouter = router;

router.get('/', acl('users', 'list'), async (req, res) => {
  const users: UserRecord[] = await db<UserRecord>('app.users').select(
    'id',
    'role',
    'login',
    'name',
    'email',
    'lastLogin'
  );

  res.json(users);
});

router.get('/check-login/:login', acl('users', 'list'), async (req, res) => {
  if (!req.params.login) return res.sendStatus(400);
  const login = await db<UserRecord>('app.users')
    .where({login: req.params.login})
    .select('login')
    .first();
  return res.json(!!login);
});

router.get('/:user', acl('users', 'read'), async (req, res) => {
  const user: Partial<UserRecord> | undefined = await db<UserRecord>(
    'app.users'
  )
    .select('id', 'login', 'role', 'name', 'email', 'lastLogin')
    .where('id', req.params.user)
    .first();

  if (!user) return res.sendStatus(404);

  const managedProfiles:
    | UserProfileRecord[]
    | undefined = await db<UserProfileRecord>('app.user_profiles as up')
    .select('p.id as id', 'p.name as name')
    .leftJoin('app.profiles as p', {'up.profileId': 'p.id'})
    .where({userId: user.id});

  return res.json({
    id: user.id,
    login: user.login,
    role: user.role,
    name: user.name,
    email: user.email,
    lastLogin: user.lastLogin,
    managedProfiles,
  });
});

router.post('/', acl('users', 'write'), async (req, res) => {
  const userData: Partial<UserRecord> = req.body;

  if (userData.password)
    userData.password = await bcrypt.hash(userData.password, 10);

  const id = await db('app.users')
    .insert(userData, ['id'])
    .then(result => result[0].id);

  res.location('/users/' + id);
  res.sendStatus(201);
});

router.patch('/:user', acl('users', 'write'), async (req, res) => {
  const userData = req.body;

  if (userData.password)
    userData.password = await bcrypt.hash(userData.password, 10);

  if (userData.managedProfiles) {
    const managedProfiles = userData.managedProfiles.map(profile => ({
      userId: req.params.user,
      profileId: profile,
    }));
    delete userData.managedProfiles;

    await db('app.user_profiles').where({userId: req.params.user}).delete();
    await db('app.user_profiles').insert(managedProfiles);
  }

  await db('app.users').where({id: req.params.user}).update(userData);

  res.sendStatus(204);
});

router.delete('/:user', acl('users', 'write'), async (req, res) => {
  await db('app.users').where({id: req.params.user}).delete();

  res.sendStatus(204);
});

router.get('/:user/profiles', acl('users', 'read'), async (req, res) => {
  const profiles = await db<UserProfileRecord>('app.user_profiles')
    .select('profileId')
    .where('userId', req.params.user)
    .then(results => results.map(profile => profile.profileId));
  res.json(profiles);
});

router.put('/:user/profiles', acl('users', 'write'), async (req, res) => {
  const data: {
    profileId: ProfileRecord['id'];
    userId: UserRecord['id'];
  }[] = req.body.map(profileId => ({
    profileId,
    userId: req.params.user,
  }));

  await db<UserProfileRecord>('app.user_profiles')
    .select('profileId')
    .where('userId', req.params.user)
    .delete();
  await db<UserProfileRecord>('app.user_profiles').insert(data);

  res.sendStatus(204);
});
