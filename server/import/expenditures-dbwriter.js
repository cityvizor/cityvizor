var Writable = require('stream').Writable;

var ExpendituresSchema = require("../models/expenditures");
var Budget = ExpendituresSchema.Budget;
var Event = ExpendituresSchema.Event;

module.exports = class ExpenditureDBWriter extends Writable {
	
	constructor(entityId,year){
		super({objectMode:true});
		this.entityId = entityId;
		this.year = year;
		this.events = [];
		this.budget = {};
	}

	_write(item, enc, next) {
		
		console.log(">>ITEM");
		this.budget = item.budget;
		this.events = item.events;
		
		this.writeEvents(() => {
			Budget.findOneAndUpdate({entityId:this.entityId,year:this.year},this.budget,{upsert:true},(err,budget) => {
				console.log("Budget");
			});
		});
	}

	writeEvents(cb){
		var event = this.events.pop(this.events);
		
		if(!event) {
			cb();
			return;
		}
			
		Event.findOne({entityId:this.entityId,id:event.id},(err,eventDB) => {
			if(!eventDB){
				eventDB = new Event({
					entityId: this.entityId,
					id: event.id,
					name: event.name,
					yearData: [],
					gps: event.gps
				});
			}
			
			event.yearData.forEach((yearData) => {
				
				var foundYearData = eventDB.yearData.some((item,i) => {
					eventDB.yearData[i] = yearData;
					return true;
				});
				
				if(!foundYearData) eventDB.yearData.push(yearData);
			});
			
			eventDB.save((err,newEventDB) => {
				
				console.log("Event #" + newEventDB._id + " (" +  newEventDB.name + ")");
				
				this.budget.paragraphs.forEach((paragraph) => {
					paragraph.events.forEach((paragraphEvent) => {
						if(paragraphEvent.id === newEventDB.id) paragraphEvent.event = newEventDB._id;
					});
				});
				
				this.writeEvents(cb);
			});

		});
	}
		
}