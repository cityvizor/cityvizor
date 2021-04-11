import express from 'express';
import getExpeditiousCache from 'express-expeditious';
import redisEngine from 'expeditious-engine-redis';
import config from '../config';

const router = express.Router();

const cache = getExpeditiousCache({
  namespace: 'cv',
  // Disable caching when running in dev mode
  defaultTtl: process.env.NODE_ENV === 'local' ? '1 second' : '5 minutes',
  engine: redisEngine({
    redis: {
      host: config.redis.host,
      port: config.redis.port,
    },
  }),
});

export const Routers = router;

import {PublicRouter} from './public';
import {SearchRouter} from './search';
import {StaticRouter} from './static';
import {ImportRouter} from './import';
import {AdminRouter} from './admin';
import {AccountRouter} from './account';
import {ExportsRouter} from './exports';

router.use('/api/account', AccountRouter);

router.use('/api/admin', AdminRouter);

router.use('/api/public', cache, PublicRouter);

router.use('/api/import', ImportRouter);

router.use('/api/search', SearchRouter);

router.use('/api/exports', ExportsRouter);

router.use('/api/**', (req, res) => res.sendStatus(404));

router.use(StaticRouter);
