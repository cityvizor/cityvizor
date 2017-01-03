var Writable = require('stream').Writable;

var ExpendituresSchema = require("../models/expenditures");
var Budget = ExpendituresSchema.Budget;
var Event = ExpendituresSchema.Event;

/**
	* Writable stream to save data to database
	**/
module.exports = class ExpenditureDBWriter extends Writable {
	
	constructor(profileId,year){
		
		// if objectMode not true, stream accepts only strings and throws weird error
		super({objectMode:true});
		
		// save key
		this.profileId = profileId;
		this.year = year;
		
		// We need event index to fill in the eventId field of EventDetails
		
		// firstly we cork the stream so no data comes before we have the event index
		this.cork();
		
		// Get the event ids from MongoDB
		Event.find({profileId:this.profile_id}, "_id id", (err,eventList) => {
			
			// Create the event index
			this.eventIndex = {};
			eventList.forEach(item => this.eventIndex[item.id] = item._id);
			
			// Uncork the stream so that it is writable
			this.uncork();
		});
		
	}

	// this method is called when someone calls Stream.write on this stream.
	_write(item, enc, next) {
		
		// We need to somehow distinguish what type of data has transformer produced (maybe clearer solution would be somehow divide to more Writable streams)
		if(!item || !item.type) throw new Error("Input data must be of type {type: string, data: any}, instead: " + JSON.stringify(item));
		
		switch(item.type){
				
			case "events": 
				return this.writeEvents(item.data, enc, next);
				
			case "budget":
				return this.writeBudget(item.data, enc, next);
				
			default:
				throw new Error("item.type is not recognized. Valid options: events, budget");
		}
	}

	/**
		* method to write many events to database
		**/
	writeEvents(events, enc, next){
		console.log("EVENTS: " + events.length);		
		next();
	}
	
	/**
		* method to write one budget object to database (since there is one per profileId+year it doesnt make sense to write more)
		**/
	writeBudget(budget, enc, next){
		
		console.log("BUDGET");
		
		Budget.findOneAndUpdate({profileId:this.profileId,year:this.year},budget,{upsert:true})
			.then(budget => next())
			.catch(err => {throw new Error("Failed to write budget to database. Error: " + err)});
	}
		
}