var mongoose = require('mongoose');

module.exports = async function(){
  await mongoose.disconnect().then(() => console.log("Disconnected"))    
};