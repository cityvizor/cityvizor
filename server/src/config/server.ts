import environment from '../../environment';

export const serverConfig = {
  host: environment.host,
  port: environment.port,

  compression: false,
};
