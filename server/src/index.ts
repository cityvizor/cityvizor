
(async function(){

  console.log("Starting CityVizor");
  console.log("Node version: " + process.version);

  /* SERVER */
  await import("./server");

  /* CRON */
  await import("./cron");

})();
