
var https = require('https');
var cheerio = require("cheerio");

var Profile = require("../models/profile");
var NoticeBoard = require("../models/noticeboard");

var config = require("../config/config");

// how many contracts per profile should be downloaded
var limit = 20;

module.exports = function(cb){

	// get all the profiles
	Profile.find({})
		.then(profiles => {

			console.log("Found " + profiles.length + " profiles to download documents for.");

			// starts the loop to download contracts
			downloadLoop(profiles,() => {
				
				cb();
				
			});
		})
		.catch(err => console.log("Error: " + err.message));

};


function downloadLoop(profiles,cb){

	// get a profile to download contracts for
	let profile = profiles.pop();
	
	// if we don't have any means our work is finished, hooray!
	if(!profile) {
		console.log("---");
		console.log("Finished");
		cb();
		return;
	}
	
	console.log("---");
	console.log("Requesting download for profile " + profile.name);
	
	// if no ID we can continue to next one
	if(!profile.edesky) {
		console.log("Variable profile.edesky empty, aborting.");
		return downloadLoop(profiles,cb);
	}
	
	var params = {
		"api_key": config.eDesky.api_key,
		"dashboard_id": profile.edesky,
		"order": "date",
		"search_with": "sql",
		"page": 1
	};

	// options for HTPPS request
	let options = {
		host: config.eDesky.host,
		port: config.eDesky.port,
		path: config.eDesky.path + "?" + Object.keys(params).map(key => key + "=" + params[key]).join("&"),
		method: 'GET'
	};

	// request data from by HTTPS
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

			// variable to write to DB
			let noticeBoard = {
				edesky: profile.edesky,
				profile: profile._id,
				documents: []
			};

			// assign values, create contracts' data
			$("document").slice(0,25).each((i,document) => {
				
				let nbDocument = {
					profile: profile._id,

					date: new Date($(document).attr("created_at")),
					title: $(document).attr("name"),
					category: $(document).attr("category"),

					documentUrl: $(document).attr("orig_url"),
					edeskyUrl: $(document).attr("edesky_url"),
					previewUrl: $(document).attr("edesky_text_url"),
					
					attachments: []
				}
				
				$(document).find("attachment").each((i,attachment) => {
					nbDocument.attachments.push({
						name: $(attachment).attr("name"),
						mime: $(attachment).attr("mime"),
						url: $(attachment).attr("orig_url")					
						
					});
				});
				
				noticeBoard.documents.push(nbDocument);
			});

			NoticeBoard.remove({profile:profile._id})
				.then(() => {

				console.log("Removed old documents");

				// insert all the contracts to DB
				NoticeBoard.create(noticeBoard).then(documents => {
					console.log("Written " + noticeBoard.documents.length + " documents");
					downloadLoop(profiles,cb);
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
