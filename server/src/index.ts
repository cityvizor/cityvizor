
(async function(){

  console.log("Starting CityVizor");
  console.log("Node version: " + process.version);

  /* SERVER */
  await import("./server");

  /* WORKER */
  await import("./worker");

})();
