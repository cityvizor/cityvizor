
var environment = process.env.NODE_ENV || "development";
var configPath = "./config." + environment;

try{
  
  console.log("Loaded config: " + configPath);
  
  module.exports = require(configPath);
}
catch(err){
  throw new Error("Configuration file server/config/config." + environment + ".js is either missing or faulty. Please use the config.*.example.js files as a template.");
}