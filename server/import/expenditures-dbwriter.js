var Writable = require('stream').Writable;

var ExpendituresSchema = require("../models/expenditures");
var Budget = ExpendituresSchema.Budget;
var Event = ExpendituresSchema.Event;
var EventBudget = ExpendituresSchema.EventBudget;

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
		
		this.counter = {
			events: 0,
			eventsBudgets: 0,
			budgets: 0
		};
		
	}

	// this method is called when someone calls Stream.write on this stream.
	_write(item, enc, next) {
		
		// We need to somehow distinguish what type of data has transformer produced (maybe clearer solution would be somehow divide to more Writable streams)
		if(!item || !item.type) throw new Error("Input data must be of type {type: string, data: any}, instead: " + JSON.stringify(item));
		
		switch(item.type){
				
			case "events": 
				return this.writeEvents(item.data, enc, next);
				//console.log("write events");next();return;
				
			case "budget":
				return this.writeBudget(item.data, enc, next);
				//console.log("write budget");next();return;
				
			default:
				throw new Error("item.type is not recognized. Valid options: events, budget");
		}
	}
	
	_flush(item, enc, next){
		console.log("FINISHED: " + JSON.stringify(this.counter));	
	}

	/**
		* method to write many events to database
		**/
	writeEvents(events, enc, next){
		
		// we take one event from the stack
		var event = events.pop();
		
		// we want to save event budget data in another table
		var eventBudget = event.budget;
		delete event.budget;
		
		// search for existing event and update it. if does not exist, create a new one
		Event.findOneAndUpdate({profileId:this.profileId, id:event.id}, event, {upsert:true,new:true})
			
			.then((event) => {
				this.counter.events++;
				// assign event id to the eventBudget
				eventBudget.eventId = event._id;
				// create eventbudget document
				EventBudget.create(eventBudget)
					.then(() => {
						this.counter.eventsBudgets++;
						console.log(this.counter);	
						//if there are more events, start this method from beggining, else call next
						if(events.length) this.writeEvents(events, enc, next);
						else next();
					})
					.catch(err => {
						throw new Error("Failed to write event budget to database. Error: " + err)
					});
			})
		
			.catch(err => {
				throw new Error("Failed to write event to database. Error: " + err)
			});
	}
	
	/**
		* method to write one budget object to database (since there is one per profileId+year it doesnt make sense to write more)
		**/
	writeBudget(budget, enc, next){
		
		Budget.findOneAndUpdate({profileId:this.profileId,year:this.year},budget,{upsert:true})
			.then(budget => {
				this.counter.budgets++;
				console.log(this.counter);	
				next();
			})
			.catch(err => {throw new Error("Failed to write budget to database. Error: " + err)});
	}
		
}