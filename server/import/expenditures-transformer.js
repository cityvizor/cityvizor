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
		
		this.mandatoryFields = ["module","paragraph","amount"];
		
		this.headerNames = {
			type: ["PRIJEM_VYDAJ"],
			module: ["MODUL","DOKLAD_AGENDA"],
			paragraph: ["PARAGRAF"],
			item: ["POLOZKA"],
			event: ["AKCE","ORJ"],
			amount: ["CASTKA"],
			date: ["DOKLAD_DATUM"],
			counterpartyId: ["SUBJEKT_IC"],
			counterpartyName: ["SUBJEKT_NAZEV"],
			description: ["POZNAMKA"]
		};
			
	}

	reset(){
		
		// counter of input rows
		this.i = 0;
		
		// array to store all the Promises with requests to DB so that we can track when everything resolves
		this.requests = [];
		
		this.invoices = [];
		
		// object to store budget data and array-indexes through the transform
		this.budget = {
			profile: this.profileId,
			year: this.year,
			budgetAmount: 0,
			expenditureAmount: 0,
			incomeAmount: 0,
			paragraphs: []
		};
		this.paragraphIndex = {};
		this.paragraphEventIndex = {};		
		
		// variables to store event budgets
		this.eventBudgets = [];
		this.eventBudgetIndex = {};
		this.eventBudgetParagraphIndex = {};
		this.eventBudgetItemIndex = {};
		
		this.headerMap = {};
	}
	
	parseHeader(header){
								
		header = header.map(item => item.toUpperCase());
		
		let headerOK = true;
		
		let missingMandatory = [];
		
		Object.keys(this.headerNames).forEach(key => {
			
			let names = this.headerNames[key];
			
			let search = names.some(name => {
				this.headerMap[key] = header.indexOf(name);
				if(this.headerMap[key] >= 0) return true;
			});
			
			// in case field not found, then either report error is some fmissing fields are mandatory or emit warning
			if(!search){
				if(this.mandatoryFields.indexOf(key) >= 0) missingMandatory.push(key);
				else this.emit("warning","Hlavička CSV: nenalezeno volitelné pole " + names.join("/") + ".");
			}
			
		});
		
		// if error is returned, error event will be emitted and this stream stopped
		if(missingMandatory.length) return new Error("Hlavička CSV: nenalezena povinná pole " + missingMandatory.map(key => this.headerNames[key].join("/")).join(", ") + ".");
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
				incomeAmount: 0,
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
				budgetAmount: 0,
				incomeAmount: 0
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
				budgetAmount: 0,
				incomeAmount: 0
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
				budgetAmount: 0,
				incomeAmount: 0
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
				budgetAmount: 0,
				incomeAmount: 0
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
		
		// first row = header
		if(this.i === 1){
			return next(this.parseHeader(item));
		}
		
		var h = this.headerMap;
		
		var module = item[h.module];

		var paragraphId = item[h.paragraph];
		var itemId = item[h.item];
		var eventId = item[h.event];
		
		var isIncome = item[h.type] ? (item[h.type] === "P") : (Number(itemId) < 5000);
		
		var budget = this.budget;

		var paragraph = this.getParagraph(paragraphId);
		
		var eventBudget = this.getEventBudget(eventId);

		var eventBudgetParagraph = this.getEventBudgetParagraph(eventBudget, paragraphId);
		var eventBudgetItem = this.getEventBudgetItem(eventBudget, itemId);
		
		var paragraphEvent = this.getParagraphEvent(paragraph,eventId);
		
		var amount = this.string2number(item[h.amount]);
		
		// critical errors, skip item
		if(isNaN(amount)) { this.emit("warning","Data: Nečitelná částka na řádku " + this.i +  ". Záznam byl přeskočen."); return next(); }
		if(!paragraphId && !isIncome) { this.emit("warning","Data: Neuveden paragraf na řádku " + this.i +  ". Záznam byl přeskočen."); return next(); }
		if(!module) { this.emit("warning","Data: Neuveden modul na řádku " + this.i +  ". Záznam byl přeskočen."); return next(); }
		if(!item[h.type] && !itemId) { this.emit("warning","Data: Neuvedeno zda se jedná o příjem či výdej ani rozpočtová položka na řádku " + this.i +  ". Záznam byl přeskočen."); return next(); }
		
		// noncritical errors
		if(!amount) this.emit("warning","Data: Nulová částka na řádku " + this.i +  ".");
		if(!itemId) this.emit("warning","Data: Neuvedena rozpočtová položka na řádku " + this.i +  ".");
		if(!item[h.date]) this.emit("warning","Data: Neuvedeno datum na řádku " + this.i +  ".");
		if(item[h.counterpartyId] && !item[h.counterpartyName]) this.emit("warning","Data: Neuvedeno jméno dodavatele na řádku " + this.i +  ".");
	
		// determine which module is the amount and assign to the corrrect property
		var amountTarget;
		
		/* Budget amount */
		if(module === "ROZ" && Number(itemId) >= 5000) amountTarget = "budgetAmount";
		
		/* Income amount - budget items 1 - 4999 are income */
		else if(isIncome) amountTarget = "incomeAmount";
		
		/* Expenditure amount */
		else if(!isIncome) amountTarget = "expenditureAmount";
		
		/* Emit warning if other data */
		else this.emit("warning","Neidentifikovaný záznam na řádku " + this.i +  ".");
		
		// assign for the following objects
		[budget, paragraph, eventBudget, eventBudgetParagraph, eventBudgetItem, paragraphEvent].map(item => item[amountTarget] = item[amountTarget] + amount);
		
		// if record is an invoice, then store it in invoices
		if(module === "KDF"){	
			this.invoices.push({
				profile: this.profileId,
				event: eventId,
				year: this.year,
				item: itemId,
				paragraph: paragraphId,
				date: this.string2date(item[h.date]),
				amount: amount,
				counterpartyId: item[h.counterpartyId],
				counterpartyName: item[h.counterpartyName],
				description: item[h.description]
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
				this.emit("writeDB","invoices",invoices.length);
			})
			.catch(err => {
				throw new Error("Failed to write invoices to database. Error: " + err)
			});
	}
	
	writeEventBudgets(){
		
		return EventBudget.insertMany(this.eventBudgets)
			
			.then(budgets => {
			console.log(this.eventBudgets.length);
				this.emit("writeDB","eventBudgets",this.eventBudgets.length);
			})
		
			.catch(err => {
				throw new Error("Failed to write event budgets to database. Error: " + err)
			});
	}
	
	/**
		* method to write one budget object to database (since there is one per profileId+year it doesnt make sense to write more)
		**/
	writeBudget(){
		
		if(!this.budget.budgetAmount) this.emit("warning","Nulový objem rozpočtu obce.");
		if(!this.budget.expenditureAmount) this.emit("warning","Nulový objem výdajů obce.");
		if(!this.budget.incomeAmount) this.emit("warning","Nulový objem příjmů obce.");
		
		return Budget.create(this.budget)
			.then(() => this.emit("writeDB","budgets",1))
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
			this.emit("closeDB");
			this.reset();
		});
		
	}
}