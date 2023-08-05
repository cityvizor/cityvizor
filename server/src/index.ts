/* eslint-disable @typescript-eslint/no-var-requires */
const packageConfig = require('.package.json');

void (async () => {
  console.log('Starting CityVizor');
  console.log('Node version: ' + process.version);
  console.log('CityVizor version: ' + packageConfig.version);

  /* SERVER */
  await import('./server');

  /* WORKER */
  await import('./worker');
})();
