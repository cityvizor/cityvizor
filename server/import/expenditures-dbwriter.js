var Writable = require('stream').Writable;

var ExpendituresSchema = require("../models/expenditures");
var Budget = ExpendituresSchema.Budget;
var Event = ExpendituresSchema.Event;

module.exports = class ExpenditureDBWriter extends Writable {
	
	constructor(ico,year) {
		super({objectMode:true});
		this.ico = ico;
		this.year = year;
		this.events = [];
		this.budget = {};
	}

	_write(item, enc, next) {
		
		console.log(">>ITEM");
		this.budget = item.budget;
		this.events = item.events;
		
		this.writeEvents(() => {
			Budget.findOneAndUpdate({ico:this.ico,year:this.year},this.budget,{upsert:true},(err,budget) => {
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
			
		Event.findOne({ico:this.ico,id:event.id},(err,eventDB) => {
			if(!eventDB){
				eventDB = new Event({
					ico: this.ico,
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