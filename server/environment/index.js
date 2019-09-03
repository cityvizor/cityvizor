/* LOAD ENVIRONMENT CONFIG */
const environmentName = (process.env.NODE_ENV || "development");
console.log("[CONFIG] Loading configuration for environment: " + environmentName);

try {
  module.exports = require("./environment." + environmentName + ".js");
}
catch (e) {  
  console.error(`[CONFIG] Could not load environment file server/environment/environment.${environmentName}.js. File is either missing or invalid.`);
  console.error(e.message);
  process.exit(1);
}