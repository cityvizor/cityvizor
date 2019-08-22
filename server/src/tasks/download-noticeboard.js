
var request = require('request-promise-native');
var cheerio = require("cheerio");

var Profile = require("../models/profile");
var NoticeBoard = require("../models/noticeboard");

var config = require("../../config");

// how many contracts per profile should be downloaded
var limit = 20;

module.exports = async function(){

	// get all the profiles
	var profiles = await Profile.find({});

	console.log("Found " + profiles.length + " profiles to download documents for.");

	// starts the loop to download contracts
	for(let i in profiles){
		try{
			await downloadNoticeboards(profiles[i]);
		}catch(err){
			console.error("Couldn't download noticeboard for " + profiles[i].name + ": " + err.message);
		}
	}

}


async function downloadNoticeboards(profile){

	console.log("---");
	console.log("Requesting download for profile " + profile.name);
	
	// if no ID we can continue to next one
	if(!profile.edesky) {
		console.log("Variable profile.edesky empty, aborting.");
		return;
	}
	
	let params = {
		"api_key": config.eDesky.api_key,
		"dashboard_id": profile.edesky,
		"order": "date",
		"search_with": "sql",
		"page": 1
	};
	
	var url = config.eDesky.url + "?" + Object.keys(params).map(key => key + "=" + params[key]).join("&");

	// request data from by HTTPS
	var xml = await request(url);

	var $ = cheerio.load(xml);

	// variable to write to DB
	var noticeBoard = {
		edesky: profile.edesky,
		profile: profile.id,
		documents: []
	};

	// assign values, create contracts' data
	$("document").slice(0,25).each((i,document) => {

		let nbDocument = {
			profile: profile.id,

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

	await NoticeBoard.remove({profile:profile.id});
		// insert all the contracts to DB
	await NoticeBoard.create(noticeBoard);

	// update last update timestamp for contracts
	profile.noticeboards.lastUpdate = new Date();
	profile.markModified("noticeboards");

	await profile.save();
	
	console.log("Written " + noticeBoard.documents.length + " documents");
	
}