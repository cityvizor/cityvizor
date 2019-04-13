
var async = require("async");

var ETL = require("../models/etl");
var Importer = require("../import/importer");

module.exports = async function(){

  console.log("Autoimport started!");

  var etls = await ETL.find({ "enabled": true }).populate("profile","_id name");

  for(let etl of etls){

    console.log("=====");
    console.log("Starting autoimport for profile " + etl.profile.name + ", year " + etl.year);

    try{
      var importer = new Importer(etl);
      importer.autoImport = true;
    }
    catch(e) {
      console.log("Couldn't create Importer:", e.message);
      continue;
    }



    var options = {};

    await new Promise((resolve,reject) => {
      importer.importUrl((err,result) => {
        if(err) console.log("Error: " + err.message);
        else console.log(result);
        resolve();
      });		
    });
  }

  console.log("======");
  console.log("Finished all!");
}