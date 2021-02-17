// @ts-check
const path = require('path');

const cityvizorPath = path.resolve(__dirname, '../../');

module.exports = {
  port: 3000,
  host: '::',

  url: process.env.URL,

  apiRoot: '/api',

  tmpDir: path.resolve(cityvizorPath, 'data/tmp'),
  storageDir: path.resolve(cityvizorPath, 'data'),

  staticFiles: path.resolve(cityvizorPath, 'client/dist'),

  database: {
    client: 'pg',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT || 5432,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: !!process.env.DATABASE_SSL,
  },

  redis: {
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || 'redis.cityvizor.otevrenamesta',
    // 10 minutes
    ttl: process.env.REDIS_TTL || 600,
  },

  cors: true,
  corsOrigin: process.env.URL,

  keys: {
    edesky: {api_key: process.env.EDESKY_API_KEY},
    jwt: {secret: process.env.JWT_SECRET},
    productboard: {token: process.env.PRODUCTBOARD_TOKEN},
  },
};
