
import environment from "./environment";

(async function(){

  console.log("Starting CityVizor");
  console.log("Node version: " + process.version);
  
  /* FILE STORAGE */
	await import("./file-storage");

	/* DATABASE */
  await import("./db");
  
  /* SERVER */
  await import("./server");

  /* CRON */
  await import("./cron");

})();
