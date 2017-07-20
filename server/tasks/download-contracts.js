
var https = require('https');

var Profile = require("../models/profile");
var Contract = require("../models/contract");

var cheerio = require("cheerio");

// how many contracts per profile should be downloaded
var limit = 20;

module.exports = function(cb){

	// get all the profiles
	Profile.find({}).populate("entity","ico")
		.then(profiles => {

			console.log("Found " + profiles.length + " profiles to download contracts for.");

			// starts the loop to download contracts
			downloadContractsLoop(profiles,() => {
				
				cb();
				
			});
		});

};


function parseAmount(string){
	if(string.trim() === "Neuvedeno") return [null,null];
	var matches = string.match(/([\d ]+) ([A-Z]+)/);		
	return [Number(matches[1].replace(/[^\d]/g,"")),matches[2]];
}

function parseDate(string){
	var matches = string.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
	return new Date(matches[3],matches[2]-1,matches[1]);
}


function downloadContractsLoop(profiles,cb){

	// get a profile to download contracts for
	let profile = profiles.pop();

	// if we don't have any means our work is finished, hooray!
	if(!profile) {
		console.log("---");
		console.log("Finished");
		cb();
		return;
	}
	// options for HTPPS request
	let options = {
		host: 'smlouvy.gov.cz',
		port: 443,
		path: "/vyhledavani?searchResultList-limit=" + limit + "&do=searchResultList-setLimit&subject_idnum=" + profile.entity.ico + "&all_versions=0",
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

			let $ = cheerio.load(str);

			// variable to prepare contracts for writing to DB
			let contracts = [];
			

			// assign values, create contracts' data
			$("tr","#snippet-searchResultList-list").each((i,row) => {
				
				if(i === 0) return;
				
				let items = $(row).children();
				
				let amount = parseAmount(items.eq(4).text().trim());
				
				let contract = {
					"profile": profile._id,
					"title":  items.eq(1).text().trim(),
					"date": parseDate(items.eq(3).text().trim()),
					"amount": amount[0],
					"currency": amount[1],
					"counterparty": items.eq(5).text().trim(),
					"url": "https://smlouvy.gov.cz" + items.eq(6).find("a").attr("href")
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
					downloadContractsLoop(profiles,cb);
				});

			})
				.catch(e => {
				console.log("Error: " + e.message);
			});

		});
	});

	req.on('error', (e) => {
		console.error("Error: " + e.message);
	});

	req.end();
}
