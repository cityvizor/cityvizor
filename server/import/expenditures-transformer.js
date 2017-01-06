var Transform = require('stream').Transform;

var mongoose = require("mongoose");
var ExpendituresSchema = require("../models/expenditures");
var Budget = ExpendituresSchema.Budget;
var Event = ExpendituresSchema.Event;
var EventBudget = ExpendituresSchema.EventBudget;

module.exports = class ExpenditureTransformer extends Transform {

	constructor(profileId,year) {
		super({objectMode:true});
		this.profileId = profileId;
		this.year = year;
		
		this.reset();
		this.loadEventList();
	}
	
	log(msg){
		console.log(msg);	
	}

	reset(){
		
		this.i = 0;
		this.counter = {
			events: 0,
			eventBudgets: 0,
			budgets: 0
		};
		
		this.budget = {
			profile: this.profileId,
			year: this.year,
			budgetAmount: 0,
			expenditureAmount: 0,
			paragraphs: []
		};
		
		this.events = [];
		this.eventIndex = {};
		this.eventParagraphIndex = {};
		
		this.eventBudgets = [];
		this.eventBudgetIndex = {};
		this.eventBudgetParagraphIndex = {};
		this.eventBudgetItemIndex = {};

		this.paragraphIndex = {};
		this.paragraphEventIndex = {};
		
	}
	
	loadEventList(){
		this.cork();				
		Event.find({profile:this.profileId},"id _id", (err,eventIds) => {
			eventIds.forEach(item => {
				this.events.push(item);
				this.eventIndex[item.id] = item;
			});
			this.uncork();			
		});
	}

	getParagraph(paragraphId) {
		if (!this.paragraphIndex[paragraphId]) {
			var paragraph = {
				id: paragraphId,
				expenditureAmount: 0,
				budgetAmount: 0,
				events: []
			};
			this.budget.paragraphs.push(paragraph);
			this.paragraphIndex[paragraphId] = paragraph;
		}
		return this.paragraphIndex[paragraphId];
	}
	
	getEvent(eventId){
		
		var event = this.eventIndex[eventId];
		
		if (!event) {
			
			event = {
				_id: mongoose.Types.ObjectId(),
				id: eventId,
				name: "",
				gps: null
			};			
			
			this.events.push(event);
			this.eventIndex[eventId] = event;
		}
		
		return event;
	}
	
	getEventBudget(event){
		var budget = this.eventBudgetIndex[event.id];		
		
		if(!budget){
			budget = {
				event: event._id,
				eventId: event.id,
				profile: this.profileId,
				year: this.year,
				paragraphs: [],
				items: [],
				expenditureAmount: 0,
				budgetAmount: 0
			};
			this.eventBudgets.push(budget);
			this.eventBudgetIndex[event.id] = budget;
		}
		
		return budget;
	}

	getEventBudgetParagraph(eventBudget, paragraphId) {
		var epId = eventBudget.eventId + "-" + paragraphId;
		
		var eventBudgetParagraph = this.eventBudgetParagraphIndex[epId];
		
		if (!this.eventBudgetParagraphIndex[epId]) {
			
			eventBudgetParagraph = {
				id: paragraphId,
				expenditureAmount: 0,
				budgetAmount: 0
			};
			
			eventBudget.paragraphs.push(eventBudgetParagraph);
			this.eventBudgetParagraphIndex[epId] = eventBudgetParagraph;
		}
		
		return eventBudgetParagraph;
	}
	
	getEventBudgetItem(eventBudget, itemId) {
		var epId = eventBudget.eventId + "-" + itemId;
		
		var eventBudgetItem = this.eventBudgetItemIndex[epId];
		
		if (!this.eventBudgetItemIndex[epId]) {
			
			eventBudgetItem = {
				id: itemId,
				expenditureAmount: 0,
				budgetAmount: 0
			};
			
			eventBudget.items.push(eventBudgetItem);
			this.eventBudgetItemIndex[epId] = eventBudgetItem;
		}
		
		return eventBudgetItem;
	}
	
	getParagraphEvent(paragraph,event){
		var epId = paragraph.id + "-" + event.id;
		
		var paragraphEvent = this.paragraphEventIndex[epId];
		
		if (!paragraphEvent) {
			
			paragraphEvent = {
				event: event._id,
				name: event.name,
				expenditureAmount: 0,
				budgetAmount: 0
			};
			
			paragraph.events.push(paragraphEvent);
			this.paragraphEventIndex[epId] = paragraphEvent;
		}
		return paragraphEvent;
	}
	
	string2number(string){
		if(!string) return 0;
		if(string.charAt(string.length - 1) === "-") string = "-" + string.substring(0,string.length - 1); // sometimes minus is at the end, put it to first character
		string.replace(",","."); // function Number accepts only dot as decimal point
		return Number(string);
	}

	_write(item, enc, next) {
		
		this.i++;
		
		if(item.length < 9){next();return;} // invalid row
		if(this.i === 1){next();return;} // first row = header

		var paragraphId = item[0];
		var itemId = item[4];
		
		var budget = this.budget;

		var paragraph = this.getParagraph(paragraphId);

		var event = this.getEvent(item[1]);
		event.name = item[2]; // name
		
		var eventBudget = this.getEventBudget(event);

		var eventBudgetParagraph = this.getEventBudgetParagraph(eventBudget, paragraphId);
		var eventBudgetItem = this.getEventBudgetItem(eventBudget, itemId);
		
		var paragraphEvent = this.getParagraphEvent(paragraph,event);
		
		/* Set amounts */
		var amount;

		/* Expenditure amount */
		amount = this.string2number(item[6]);

		[budget, paragraph, eventBudget, eventBudgetParagraph, eventBudgetItem, paragraphEvent].map(item => item.expenditureAmount = item.expenditureAmount + amount);

		/* Budget amount */
		amount = this.string2number(item[8]);

		[budget, paragraph, eventBudget, eventBudgetParagraph, eventBudgetItem, paragraphEvent].map(item => item.budgetAmount = item.budgetAmount + amount);

		/* Let next row come */
		next();
	}
	
	writeEvents(events){
		return new Promise((resolve,reject) => {
			this.writeEventsLoop(events,resolve,reject);
		});
	}
	
	/**
		* method to write many events to database
		**/
	writeEventsLoop(events, resolve, reject){

		// we take one event from the stack
		var event = events.pop();

		// search for existing event and update it. if does not exist, create a new one
		return Event.findOneAndUpdate({profile:this.profileId, id:event.id}, event, {upsert:true})

			.then((event) => {
				this.counter.events++;
				if(events.length) this.writeEventsLoop(events, resolve, reject);
				else resolve();
			})

			.catch(err => reject(err));
	}
	
	writeEventBudgets(eventBudgets){
		return EventBudget.insertMany(eventBudgets)
			
			.then(budgets => {
				this.counter.eventBudgets += eventBudgets.length;
			})
		
			.catch(err => {
				throw new Error("Failed to write event budgets to database. Error: " + err)
			});
	}
	
	/**
		* method to write one budget object to database (since there is one per profileId+year it doesnt make sense to write more)
		**/
	writeBudget(budget,cb){
		return Budget.create(budget).then(() => this.counter.budgets++);
	}
	
	_flush(next) {		
		
		var requests = [];
		
		requests.push(this.writeEvents(this.events));
		
		requests.push(this.writeEventBudgets(this.eventBudgets));

		requests.push(this.writeBudget(this.budget));

		Promise.all(requests).then(() => console.log(this.counter));
		
	}
}