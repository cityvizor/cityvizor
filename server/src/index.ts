
import environment from "./environment";

import { startServer } from "./server";

(async function(){

  console.log("Starting CityVizor");
  console.log("Node version: " + process.version);
  
  /* FILE STORAGE */
	await import("./file-storage");

	/* DATABASE */
  await import("./db");
  
  /* SERVER */
  startServer();

})();
