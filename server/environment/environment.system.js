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

  s3: {
    enabled: !!process.env.S3_HOST,
    // host for API calls, can be internal CNI/container name/private network
    host: process.env.S3_HOST,
    // host for general public access, eg. https://minio.cityvizor.cz/
    cdn_host: process.env.S3_CDN_HOST,
    port: process.env.S3_PORT || 9000,
    access_key: process.env.S3_ACCESS_KEY,
    secret_key: process.env.S3_SECRET_KEY,
    use_ssl: true,
    private_bucket: process.env.S3_PRIVATE_BUCKET || 'cityvizor',
    public_bucket: process.env.S3_PUBLIC_BUCKET || 'cityvizor-public',
  },

  cors: true,
  corsOrigin: process.env.URL,

  keys: {
    edesky: {api_key: process.env.EDESKY_API_KEY},
    jwt: {secret: process.env.JWT_SECRET},
    productboard: {token: process.env.PRODUCTBOARD_TOKEN},
  },
};
