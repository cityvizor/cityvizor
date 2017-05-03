var https = require('https');

/* Mongoose */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/cityvizor');

var Profile = require("../server/models/profile");
var Contract = require("../server/models/contract");

var profiles = [];

// how many contracts per profile should be downloaded
var limit = 20;

// get all the profiles
Profile.find({}).populate("entity","ico").then(data => {
  
  // save the profiles to global variable
  profiles = data;
  
  console.log("Found " + profiles.length + " profiles to download contracts for.");
  
  // starts the loop to download contracts
  downloadContractsLoop();
});

function parseAmount(string){
  if(string.trim() === "Neuvedeno") return [null,null];
  var matches = string.match(/([\d ]+) ([A-Z]+)/);		
  return [Number(matches[1].replace(/[^\d]/g,"")),matches[2]];
}

function parseDate(string){
		var matches = string.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
		return new Date(matches[3],matches[2]-1,matches[1]);
	}

//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
function downloadContractsLoop(){
  
  // get a profile to download contracts for
  let profile = profiles.pop();
  
  // if we don't have any means our work is finished, hooray!
  if(!profile) {
    console.log("---");
    console.log("Finished");
    process.exit(0); // exit process without error
  }
  
  // query string for YQL
  let queryString = "select * from html where url='https://smlouvy.gov.cz/vyhledavani?searchResultList-limit=" + limit + "&do=searchResultList-setLimit&subject_idnum=" + profile.entity.ico + "&all_versions=0' and xpath='//*[@id=\"snippet-searchResultList-list\"]/table/tbody/tr'";
  
  // options for HTPPS request
  let options = {
    host: 'query.yahooapis.com',
    port: 443,
    path: "/v1/public/yql?format=json&q=" + encodeURIComponent(queryString),
    method: 'GET'
  };
  
  console.log("---");
  console.log("Requesting download for profile " + profile.name);
  
  // request data from YQL by HTTPS
  var req = https.request(options, function(response) {
    
    // variable to strore request
    let str = '';
      
    // a chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    // the whole response has been recieved
    response.on('end', function () {
      
      // received response is in string, we have to parse it to JSON
      let data = JSON.parse(str);
      
      // variable to prepare contracts for writing to DB
      let contracts = [];
      
      // assign values, create contracts' data
      data.query.results.tr.forEach(row => {
        let amount = parseAmount(row.td[4].content);
        let contract = {
          "profile": profile._id,
          "title":  row.td[1].content.trim(),
          "date": parseDate(row.td[3].content),
          "amount": amount[0],
          "currency": amount[1],
          "counterparty": row.td[5].content.trim(),
          "url": "https://smlouvy.gov.cz" + row.td[6].a.href
        };
        contracts.push(contract);
      });
      
      console.log("Received " + contracts.length + " contracts for " + profile.name);
      
      Contract.remove({profile:profile._id})
        .then(() => {
        
          console.log("Removed old contracts for " + profile.name);
        
          // insert all the contracts to DB
          Contract.insertMany(contracts).then(contracts => {
            console.log("Written " + contracts.length + " contracts for " + profile.name);
            downloadContractsLoop();
          });
        
        })
        .catch(e => {
          console.log("Error: " + e.message);
          process.exit(1); // exit process with error
        });
      
    });
  });

  req.on('error', (e) => {
    console.error("Error: " + e.message);
    process.exit(1); // exit process with error
  });
  
  req.end()
}