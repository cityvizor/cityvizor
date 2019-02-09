var mongoose = require("mongoose");
var ETL = require("../models/etl");
var Payment = require("../models/payment");
var Counterparty = require("../models/counterparty");

module.exports = async function rebuildCounterparties(etls){
	
	console.log("Rebuilding counterparties...");
	
	var query = [];
	
	if(etls) query.push({ $match: { etl: { $in: etls } } });
		
	query.push({
		$group: {
			"_id": {
				counterpartyId: "$counterpartyId",
				etl: "$etl",
			},
			"year": { $first: "$year" },
			"profile": { $first: "$profile" },
			"name": { $first: "$counterpartyName"},
			"amount": { $sum: "$amount" }
		}
	});
	
	var counterparties = await Payment.aggregate(query);
	
	// pregenerate _id
	counterparties.forEach(counterparty => {
		counterparty.counterpartyId = counterparty._id.counterpartyId;
		counterparty.etl = counterparty._id.etl;
		counterparty._id = mongoose.Types.ObjectId()
	});
	
	console.log("Found " + counterparties.length + " counterparties");

	console.log("Truncating Counterparty collection");
	
	await Counterparty.remove({});
	
	console.log("Inserting counterparties...");
	await Counterparty.insertMany(counterparties);
	
	console.log("Finished");
	console.log(counterparties.slice(0,5));
	
}