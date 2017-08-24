
var environment = process.env.NODE_ENV || "development";
var configPath = "./config." + environment;

try{
  module.exports = require(configPath);
}
catch(err){
  throw new Error("Configuration file server/config/" + environment + ".js is either missing or faulty. Please use the config.*.example.js files as a template.");
}