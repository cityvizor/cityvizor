import express from 'express';

import schema from 'express-jsonschema';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

export const AccountLoginRouter = router;

import acl from 'express-dynacl';

import config from '../../config';
import {db} from '../../db';
import {UserRecord, UserProfileRecord} from '../../schema';
import {DateTime} from 'luxon';
import {UserToken} from '../../schema/user';

async function createToken(tokenData: object, validity): Promise<string> {
  // set validity
  const tokenOptions = {
    expiresIn: validity,
  };

  return new Promise((resolve, reject) =>
    jwt.sign(tokenData, config.jwt.secret, tokenOptions, (err, token) =>
      err ? reject(err) : token ? resolve(token) : reject()
    )
  );
}

const loginSchema = {
  type: 'object',
  properties: {
    username: {type: 'string', required: true},
    password: {type: 'string', required: true},
  },
};

router.post(
  '/',
  acl('login:login'),
  schema.validate({body: loginSchema}),
  async (req, res) => {
    const user = await db<UserRecord>('app.users')
      .select('id', 'login', 'password', 'role')
      .where('login', 'like', req.body.username)
      .first();

    if (!user) return res.status(401).send('User not found');

    const same: boolean = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (same) {
      const tokenData: UserToken = {
        id: user.id,
        login: user.login,
        roles: ['user', user.role],
        managedProfiles: await db<UserProfileRecord>('app.user_profiles')
          .where({userId: user.id})
          .then(rows => rows.map(row => row.profileId)),
      };

      const token = await createToken(tokenData, '1 day');

      await db<UserRecord>('app.users')
        .where({id: user.id})
        .update({lastLogin: DateTime.local().toISO()});

      return res.send(token);
    } else {
      return res.status(401).send('Wrong password for user "' + user.id + '".');
    }
  }
);

router.get('/renew', acl('login:renew'), async (req, res) => {
  const userId = req.user.id;

  const user = await db<UserRecord>('app.users')
    .select('id', 'login', 'password', 'role')
    .where({id: userId})
    .first();

  if (!user) return res.sendStatus(404);

  const tokenData = {
    id: user.id,
    login: user.login,
    roles: ['user', user.role],
    managedProfiles: await db<UserProfileRecord>('app.user_profiles')
      .where({userId: user.id})
      .then(rows => rows.map(row => row.profileId)),
  };

  const token = await createToken(tokenData, '1 day');

  return res.send(token);
});
