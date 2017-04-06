var Transform = require('stream').Transform;

var mongoose = require("mongoose");
var ExpendituresSchema = require("../models/expenditures");
var Budget = ExpendituresSchema.Budget;
var Event = ExpendituresSchema.Event;
var EventBudget = ExpendituresSchema.EventBudget;
var Invoice = ExpendituresSchema.Invoice;

module.exports = class ExpenditureTransformer extends Transform {


	constructor(profileId,year) {
		
		// call parent constructor; objectMode:true sets that Transform stream can accept other input than string
		super({objectMode:true});
		
		// save variables to identify import
		this.profileId = profileId;
		this.year = year;
		
		// reset index objects and other variables to their initial values
		this.reset();
			
	}
	
	log(msg){
		// TODO: make some very great loggin mechanism, probably together with ETL table to store import metadata
		console.log(msg);	
	}

	reset(){
		
		// counter of input rows
		this.i = 0;
		
		// couter of written documents to DB
		this.counter = {
			eventBudgets: 0,
			budgets: 0,
			invoices: 0
		};
		
		// array to store all the Promises with requests to DB so that we can track when everything resolves
		this.requests = [];
		
		this.invoices = [];
		
		// object to store budget data and array-indexes through the transform
		this.budget = {
			profile: this.profileId,
			year: this.year,
			budgetAmount: 0,
			expenditureAmount: 0,
			paragraphs: []
		};
		this.paragraphIndex = {};
		this.paragraphEventIndex = {};		
		
		// variables to store event budgets
		this.eventBudgets = [];
		this.eventBudgetIndex = {};
		this.eventBudgetParagraphIndex = {};
		this.eventBudgetItemIndex = {};
		
	}

	/**
		* get budget paragraph object. in case it doesnt exist, create it and make a record in paragraph index
		**/
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
	
	
	/**
		* get event budget object. in case it doesnt exist, create it and make a record in event budget index
		**/
	getEventBudget(eventId){
		var budget = this.eventBudgetIndex[eventId];		
		
		if(!budget){
			budget = {
				event: eventId,
				profile: this.profileId,
				year: this.year,
				paragraphs: [],
				items: [],
				expenditureAmount: 0,
				budgetAmount: 0
			};
			this.eventBudgets.push(budget);
			this.eventBudgetIndex[eventId] = budget;
		}
		
		return budget;
	}

	getEventBudgetParagraph(eventBudget, paragraphId) {
		var epId = eventBudget.event + "-" + paragraphId;
		
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
		var epId = eventBudget.event + "-" + itemId;
		
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
	
	getParagraphEvent(paragraph,eventId){
		var epId = paragraph.id + "-" + eventId;
		
		var paragraphEvent = this.paragraphEventIndex[epId];
		
		if (!paragraphEvent) {
			
			paragraphEvent = {
				event: eventId,
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
	
	string2date(string){
		
		// 29. 3. 1989, 29. 03. 1989, 29.3.1989, 29.03.1989 
		string = string.replace(/^([0-3]?[0-9])\. ?([01]?[0-9])\. ?([0-9]{4})$/,"$3-$2-$1");

		return new Date(string);		
	}

	_write(item, enc, next) {
		
		this.i++;
		
		if(Object.keys(item).length < 11){next();return;} // invalid row
		if(this.i === 1){next();return;} // first row = header
		
		var type = item["DOKLAD_AGENDA"];

		var paragraphId = item["PARAGRAF"];
		var itemId = item["POLOZKA"];
		var eventId = item["ORJ"].trim() ? item["ORJ"].trim() : null;
		
		var budget = this.budget;

		var paragraph = this.getParagraph(paragraphId);
		
		var eventBudget = this.getEventBudget(eventId);

		var eventBudgetParagraph = this.getEventBudgetParagraph(eventBudget, paragraphId);
		var eventBudgetItem = this.getEventBudgetItem(eventBudget, itemId);
		
		var paragraphEvent = this.getParagraphEvent(paragraph,eventId);
		
		var amount = this.string2number(item["CASTKA"]);
		
		if(isNaN(amount)) console.log(item);

		// determine which type is the amount and assign to the corrrect property
		var amountTarget;
		/* Budget amount */
		if(type === "ROZ") amountTarget = "budgetAmount";
		/* Income amount */
		else if(Number(itemId) < 5000) amountTarget = "incomeAmount";
		/* Expenditure amount */
		else if(Number(itemId) >= 5000) amountTarget = "expenditureAmount < 5000";
		
		// assign for the following objects
		[budget, paragraph, eventBudget, eventBudgetParagraph, eventBudgetItem, paragraphEvent].map(item => item[amountTarget] = item[amountTarget] + amount);
		
		// if record is an invoice, then store it in invoices
		if(type === "KDF"){	
			this.invoices.push({
				profile: this.profileId,
				event: eventId,
				year: this.year,
				item: itemId,
				paragraph: paragraphId,
				date: this.string2date(item["DOKLAD_DATUM"]),
				amount: amount,
				counterpartyId: item["SUBJEKT_IC"],
				counterpartyName: item["SUBJEKT_NAZEV"],
				description: item["POZNAMKA"]
			});
			
			if(this.invoices.length >= 1000) this.requests.push(this.writeInvoices());
		}
		
		/* Let next row come */
		next();
	}
	
	writeInvoices(){
		
		var invoices = this.invoices;
		this.invoices = [];
		
		return Invoice.insertMany(invoices)
			.then(budgets => {
				this.counter.invoices += invoices.length;
			})
			.catch(err => {
				throw new Error("Failed to write invoices to database. Error: " + err)
			});
	}
	
	writeEventBudgets(){
		
		return EventBudget.insertMany(this.eventBudgets)
			
			.then(budgets => {
				this.counter.eventBudgets += this.eventBudgets.length;
			})
		
			.catch(err => {
				throw new Error("Failed to write event budgets to database. Error: " + err)
			});
	}
	
	/**
		* method to write one budget object to database (since there is one per profileId+year it doesnt make sense to write more)
		**/
	writeBudget(){
		return Budget.create(this.budget)
			.then(() => this.counter.budgets++)
			.catch(err => {
				throw new Error("Failed to write budget to database. Error: " + err)
			});
	}
	
	_flush(next) {		
		
		// store requests, so that we can watch them for completion
		var requests = this.requests;
		
		requests.push(this.writeInvoices());
		
		requests.push(this.writeEventBudgets());

		requests.push(this.writeBudget());

		Promise.all(requests).then(() => {
			console.log(this.counter);
			this.reset();
		});
		
	}
}