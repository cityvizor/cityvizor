
var request = require('request-promise-native');

var Profile = require("../models/profile");
var Contract = require("../models/contract");

var cheerio = require("cheerio");

// how many contracts per profile should be downloaded
var limit = 20;

module.exports = async function(){

	// get all the profiles
	var profiles = await Profile.find({})
	console.log("Found " + profiles.length + " profiles to download contracts for.");

	for(let i in profiles){
		try{
			await downloadContracts(profiles[i]);
		}catch(err){
			console.error("Couldn't download contracts for " + profiles[i].name + ": " + err.message);
		}
	}

}

async function downloadContracts(profile){
	
	console.log("---");
	console.log(profile.name);
	
	if(!profile.ico){
		console.log("ICO not available, aborting.");
		return;
	}
	
	var url = "https://smlouvy.gov.cz/vyhledavani?searchResultList-limit=" + limit + "&do=searchResultList-setLimit&subject_idnum=" + profile.ico + "&all_versions=0";

	// request data from YQL by HTTPS
	var html = await request(url);
	
	let $ = cheerio.load(html);

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

	await Contract.remove({profile:profile._id})

	// insert all the contracts to DB
	await Contract.insertMany(contracts);
	
	// update last update timestamp for contracts
	profile.contracts.lastUpdate = new Date();
	profile.markModified("contracts");
	
	await profile.save();
	
	console.log("Updated " + contracts.length + " contracts");

}

	function parseAmount(string){
	if(string.trim() === "Neuvedeno") return [null,null];
	var matches = string.match(/([\d ]+) ([A-Z]+)/);		
	return [Number(matches[1].replace(/[^\d]/g,"")),matches[2]];
}

function parseDate(string){
	var matches = string.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
	return new Date(matches[3],matches[2]-1,matches[1]);
}