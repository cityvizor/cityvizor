var mongoose = require('mongoose');
var config = require("../config/config");

module.exports = async function(){
  
  mongoose.Promise = global.Promise;
  mongoose.plugin(require('mongoose-write-stream'));
  mongoose.plugin(require('mongoose-paginate'));
  
  console.log("Connecting to " + config.database.uri);
  
  await mongoose.connect(config.database.uri, { useNewUrlParser: true }).then(() => console.log("Connected."))    
};