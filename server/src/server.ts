/* tslint:disable:no-console */
import http from 'http';
import express from 'express';
import 'express-async-errors';

/* DOTENV */
import dotenv from 'dotenv';
dotenv.config();

/* CONFIG */
import config from './config';

/* ROUTING */
import {Routers} from './routers';

/* MIDDLEWARE */
import {ErrorHandler} from './middleware/error-handler';
import bodyParser from 'body-parser';

import * as acl from 'express-dynacl';
import {ensureDirs} from './file-storage';
import {dbConnect} from './db';

(async () => {
  // init environment
  await ensureDirs();

  await dbConnect();
  console.log('Connected to the database.');

  // start the server

  /* SET UP ROUTING */
  const app = express();

  /* CORS FOR DEVELOPMENT */
  if (config.cors.enabled) {
    const cors = (await import('cors')).default;
    app.use(cors(config.cors));
    console.log(
      '[SERVER] CORS enabled' +
        (config.cors.origin ? ' for origin ' + config.cors.origin : '')
    );
  }

  // polyfill before express allows for async middleware
  await import('express-async-errors');

  if (config.server.compression) {
    const compression = await import('compression');
    app.use(compression());
  }

  // parse body
  app.use(bodyParser.json({})); // support json encoded bodies
  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: '10000kb',
    })
  ); // support urlencoded bodies

  /* AUTHENTICATION */
  const jwt = (await import('express-jwt')).default;
  app.use(jwt(config.jwt), (err, req, res, next) =>
    err.code === 'invalid_token' ? next() : next(err)
  );

  /* ACCESS CONTROL */
  const aclOptions = {
    roles: config.acl.roles,
    defaultRoles: ['guest'],
    // userRoles: ["user"],
    logConsole: true,
  };
  acl.config(aclOptions);

  /* ROUTING */
  app.use(Routers);

  // error handling
  app.use(ErrorHandler);

  /* SET UP SERVER */
  const host = config.server.host || '127.0.0.1';
  const port = config.server.port || 80;

  http.createServer(app).listen(port, host, () => {
    console.log('[SERVER] Listening on ' + host + ':' + port + '!');
  });
})();
