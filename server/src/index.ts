/* tslint:disable:no-console */

(async () => {
  console.log('Starting CityVizor');
  console.log('Node version: ' + process.version);
  console.log('CityVizor version: ' + require('../package.json').version);

  /* SERVER */
  await import('./server');

  /* WORKER */
  await import('./worker');
})();
