var Transform = require('stream').Transform;

var mongoose = require("mongoose");
var ExpendituresSchema = require("../models/expenditures");
var Budget = ExpendituresSchema.Budget;
var EventBudget = ExpendituresSchema.EventBudget;
var Payment = ExpendituresSchema.Payment;

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
		
		// DB object to store budget data
		this.budget = {
			profile: this.profileId,
			year: this.year,
			paragraphs: [],
			items: [],
			budgetExpenditureAmount: 0,
			budgetIncomeAmount: 0,
			expenditureAmount: 0,
			incomeAmount: 0
		};

		// Array to store event budgets of EventBudget objects
		this.eventBudgets = [];
		
		// Array to store event budgets of Payment objects
		this.payments = [];
		
		/* INDICES FOR FASTER LOOKUP */
		this.budgetItemIndex = {};
		this.budgetItemEventIndex = {};
		this.budgetParagraphIndex = {};
		this.budgetParagraphEventIndex = {};
		
		this.eventBudgetIndex = {};
		this.eventBudgetItemIndex = {};
		this.eventBudgetParagraphIndex = {};
		
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
		* get budget item object. in case it doesnt exist, create it and make a record in item index
		**/
	getBudgetItem(itemId) {
		
		if (!this.budgetItemIndex[itemId]){
			var item = {
				id: itemId,
				budgetExpenditureAmount: 0,
				budgetIncomeAmount: 0,
				expenditureAmount: 0,
				incomeAmount: 0,
				events: []
			};
			this.budget.items.push(item);
			this.budgetItemIndex[itemId] = item;
		}
		
		return this.budgetItemIndex[itemId];
	}
	
	getBudgetItemEvent(budgetItem,eventId){
		var id = budgetItem.id + "-" + eventId;
		
		if (!this.budgetItemEventIndex[id]) {
			
			var budgetItemEvent = {
				event: eventId,
				budgetExpenditureAmount: 0,
				expenditureAmount: 0,
				budgetIncomeAmount: 0,
				incomeAmount: 0
			};
			
			budgetItem.events.push(budgetItemEvent);
			this.budgetItemEventIndex[id] = budgetItemEvent;
		}
		return this.budgetItemEventIndex[id];
	}
	
	/**
		* get budget paragraph object. in case it doesnt exist, create it and make a record in paragraph index
		**/
	getBudgetParagraph(paragraphId) {
		
		if (!this.budgetParagraphIndex[paragraphId]){
			var paragraph = {
				id: paragraphId,
				budgetExpenditureAmount: 0,
				expenditureAmount: 0,
				events: []
			};
			this.budget.paragraphs.push(paragraph);
			this.budgetParagraphIndex[paragraphId] = paragraph;
		}
		
		return this.budgetParagraphIndex[paragraphId];
	}
	
	getBudgetParagraphEvent(budgetParagraph,eventId){
		var id = budgetParagraph.id + "-" + eventId;
		
		if (!this.budgetParagraphEventIndex[id]) {
			
			var budgetParagraphEvent = {
				event: eventId,
				budgetExpenditureAmount: 0,
				expenditureAmount: 0
			};
			
			budgetParagraph.events.push(budgetParagraphEvent);
			this.budgetParagraphEventIndex[id] = budgetParagraphEvent;
		}
		return this.budgetParagraphEventIndex[id];
	}
	
	
	/**
		* get event budget object. in case it doesnt exist, create it and make a record in event budget index
		**/
	getEventBudget(eventId){

		if(!this.eventBudgetIndex[eventId]){
			var budget = {
				event: eventId,
				profile: this.profileId,
				year: this.year,
				paragraphs: [],
				items: [],
				budgetExpenditureAmount: 0,
				budgetIncomeAmount: 0,
				expenditureAmount: 0,
				incomeAmount: 0
			};
			
			this.eventBudgets.push(budget);
			this.eventBudgetIndex[eventId] = budget;
		}
		
		return this.eventBudgetIndex[eventId];
	}

	getEventBudgetParagraph(eventBudget, paragraphId) {
		var ebpId = eventBudget.event + "-" + paragraphId;

		if (!this.eventBudgetParagraphIndex[ebpId]) {
			
			var eventBudgetParagraph = {
				id: paragraphId,
				budgetExpenditureAmount: 0,
				expenditureAmount: 0			
			};
			
			eventBudget.paragraphs.push(eventBudgetParagraph);
			this.eventBudgetParagraphIndex[ebpId] = eventBudgetParagraph;
		}
		
		return this.eventBudgetParagraphIndex[ebpId];
	}
	
	getEventBudgetItem(eventBudget, itemId) {
		var id = eventBudget.event + "-" + itemId;
		
		if (!this.eventBudgetItemIndex[id]) {
			
			var eventBudgetItem = {
				id: itemId,
				budgetExpenditureAmount: 0,
				budgetIncomeAmount: 0,
				expenditureAmount: 0,
				incomeAmount: 0
			};
			
			eventBudget.items.push(eventBudgetItem);
			this.eventBudgetItemIndex[id] = eventBudgetItem;
		}
		
		return this.eventBudgetItemIndex[id];
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

	_write(row, enc, next) {
		
		// row counter
		this.i++;
		
		// first row => parse header
		if(this.i === 1) return next(this.parseHeader(row));
		
		// short for header map
		var h = this.headerMap;
		
		
		/* ASSOC ROW VALUES */
		var module = row[h.module];

		var itemId = row[h.item];
		var paragraphId = row[h.paragraph];
		var eventId = row[h.event];
		
		var amountType = row[h.type];
		if(!amountType && itemId) amountType = Number(itemId) < 5000 ? "P" : (Number(itemId) >= 5000  ? "V" : null);
		
		
		/* GET AMOUNT TARGETS */
		var budget = this.budget;
		var budgetItem = this.getBudgetItem(itemId);
		var budgetItemEvent = this.getBudgetItemEvent(budgetItem,eventId);
		var budgetParagraph = this.getBudgetParagraph(paragraphId);
		var budgetParagraphEvent = this.getBudgetParagraphEvent(budgetParagraph,eventId);
		
		var eventBudget = this.getEventBudget(eventId);
		var eventBudgetItem = this.getEventBudgetItem(eventBudget, itemId);
		var eventBudgetParagraph = this.getEventBudgetParagraph(eventBudget, paragraphId);
		
		
		/* GET AMOUNT */
		var amount = this.string2number(row[h.amount]);
		
		
		/* REPORT ERRORS */
		// critical errors, skip item
		if(isNaN(amount)) { this.emit("warning","Data: Nečitelná částka na řádku " + this.i +  ". Záznam byl přeskočen."); return next(); }
		if(!row[h.type] && !itemId) { this.emit("warning","Data: Neuvedeno zda se jedná o příjem či výdej ani rozpočtová položka na řádku " + this.i +  ". Záznam byl přeskočen."); return next(); }
		
		// noncritical errors
		if(!module) this.emit("warning","Data: Neuveden modul na řádku " + this.i +  ".");
		if(!amount) this.emit("warning","Data: Nulová částka na řádku " + this.i +  ".");
		if(!itemId) this.emit("warning","Data: Neuvedena rozpočtová položka na řádku " + this.i +  ".");
		if(!itemId && amountType === "V") this.emit("warning","Data: Neuveden paragraf na řádku " + this.i +  ".");
		if(!row[h.date]) this.emit("warning","Data: Neuvedeno datum na řádku " + this.i +  ".");
		if(row[h.counterpartyId] && !row[h.counterpartyName]) this.emit("warning","Data: Neuvedeno jméno dodavatele na řádku " + this.i +  ".");
		
		/* UPDATE AMOUNTS */
		if(module === "ROZ" && amountType === "P") [budget, budgetItem, budgetItemEvent, eventBudget, eventBudgetItem].map(obj => obj.budgetIncomeAmount += amount);
		
		else if(module === "ROZ" && amountType === "V") [budget, budgetItem, budgetItemEvent,  budgetParagraph, budgetParagraphEvent, eventBudget, eventBudgetItem, eventBudgetParagraph].map(obj => obj.budgetExpenditureAmount += amount);
		
		else if(module !== "ROZ" && amountType === "P") [budget, budgetItem, budgetItemEvent, eventBudget, eventBudgetItem].map(obj => obj.incomeAmount += amount);
		
		else if(module !== "ROZ" && amountType === "V") [budget, budgetItem, budgetItemEvent, budgetParagraph, budgetParagraphEvent, eventBudget, eventBudgetItem, eventBudgetParagraph].map(obj => obj.expenditureAmount += amount);
		
		/* Emit warning if other data */
		else { this.emit("warning","Data: Neidentifikovaný záznam na řádku " + this.i +  ". Záznam byl přeskočen."); return next(); }
		
		
		/* SAVE INVOICE */
		if(row[h.counterpartyId] || module === "KDF" || row[h.description]){	
			this.payments.push({
				profile: this.profileId,
				event: eventId,
				year: this.year,
				item: itemId,
				paragraph: paragraphId,
				date: this.string2date(row[h.date]),
				amount: amount,
				counterpartyId: row[h.counterpartyId],
				counterpartyName: row[h.counterpartyName],
				description: row[h.description]
			});
			
			if(this.payments.length >= 1000) this.requests.push(this.writePayments());
		}
		
		/* Let the next row come */
		next();
	}
	
	writeBudget(){
		
		var budget = new Budget(this.budget);
		
		return budget.save()
			.then(() => this.emit("writeDB","budgets",1))
	}
	
	writePayments(){
		
		var payments = this.payments;
		this.payments = [];
		
		return Payment.insertMany(payments)
			.then(budgets => {
				this.emit("writeDB","payments",payments.length);
			})
			.catch(err => {
				throw new Error("Failed to write payments to database. Error: " + err)
			});
	}
	
	writeEventBudgets(){
		
		return EventBudget.insertMany(this.eventBudgets)
			
			.then(budgets => {
				this.emit("writeDB","eventBudgets",this.eventBudgets.length);
			})
		
			.catch(err => {
				throw new Error("Failed to write event budgets to database. Error: " + err)
			});
	}
	
	_flush(next) {
		
		// store requests, so that we can watch them for completion
		var requests = this.requests;
		
		requests.push(this.writePayments());
		
		requests.push(this.writeEventBudgets());

		requests.push(this.writeBudget());

		Promise.all(requests).then(() => {
			this.emit("closeDB");
			this.reset();
		});
		
	}
}