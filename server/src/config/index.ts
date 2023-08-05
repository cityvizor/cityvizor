import path from 'path';
import environment from '../../environment';
import {aclRoles} from './roles';
import {serverConfig} from './server';

export default {
  apiRoot: environment.apiRoot,

  acl: {
    roles: aclRoles,
  },

  cors: {
    enabled: environment.cors,
    origin: environment.corsOrigin,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
    exposedHeaders: ['Location'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  },

  redis: {
    host: environment.redis.host,
    port: environment.redis.port,
    ttl: environment.redis.ttl,
  },

  s3: {
    enabled: environment.s3.enabled,
    // host for API calls, can be internal CNI/container name/private network
    endPoint: environment.s3.host,
    // host for general public access, eg. https://minio.cityvizor.cz/
    endPointCDN: environment.s3.cdn_host,
    port: environment.s3.port,
    useSSL: environment.s3.ssl,
    accessKey: environment.s3.access_key,
    secretKey: environment.s3.secret_key,
    private_bucket: environment.s3.private_bucket,
    // to access public s3 assets via url {endPointCDN}/{public_bucket}/{object_path}
    public_bucket: environment.s3.public_bucket,
  },

  cron: {
    cronTime: '00 00 07 * * *',
    runOnInit: false,
    jobDelay: 5,
  },

  url: environment.url,

  server: serverConfig,

  static: {
    dir: environment.staticFiles,
    index: path.join(environment.staticFiles, 'index.html'),
  },

  storage: {
    tmp: path.resolve(environment.tmpDir),
    avatars: path.resolve(environment.storageDir, 'avatars'),
    imports: path.resolve(environment.storageDir, 'imports'),
  },

  jwt: {
    requestProperty: 'user',
    algorithms: ['HS256'],
    secret: environment.keys.jwt.secret,
    expiration: '1d',
    credentialsRequired: false,
    getToken: req => {
      if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
      ) {
        return req.headers.authorization.split(' ')[1];
      } else if (req.cookies && req.cookies.access_token) {
        return req.cookies.access_token;
      }
      return null;
    },
    cookieName: 'access_token',
    cookieMaxAge: 1000 * 60 * 60 * 24,
  },

  eDesky: {
    url: 'https://edesky.cz/api/v1/documents',
    api_key: environment.keys.edesky.api_key,
  },

  avatarWhitelist: [process.env.CITYVIZOR_IMAGES_URL],
};
