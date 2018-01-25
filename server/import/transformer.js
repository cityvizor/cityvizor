const fs = require("fs");
const parse = require("csv-parse");
const EventEmitter = require('events');

const mongoose = require("mongoose");

const importConfig = require("../config/import-config.js");

class ImportTransformer extends EventEmitter {

	constructor(etl){
		
		super();
		
		this.etl = etl;
		
		this.i = 0;

		this.budget = {
			etl: etl._id,
			profile: this.etl.profile,
			year: etl.year,
			budgetExpenditureAmount: 0,
			expenditureAmount: 0,
			budgetIncomeAmount: 0,
			incomeAmount: 0,
			items: [],
			paragraphs: []
		};
		
		this.events = [];
		this.eventIndex = {};
		
		this.payments = [];

		this.budgetItemIndex = {};
		this.budgetItemEventIndex = {};
		this.budgetParagraphIndex = {};
		this.budgetParagraphEventIndex = {};

		this.eventIndex = {};
		this.eventItemIndex = {};
		this.eventParagraphIndex = {};
		
	}

	
	finish(cb){
		
		if(!this.budget.budgetExpenditureAmount) this.emit("warning","Celková výše rozpočtovaných výdajů je nulová");
		if(!this.budget.expenditureAmount) this.emit("warning","Celková výše výdajů je nulová");
		if(!this.budget.budgetIncomeAmount) this.emit("warning","Celková výše rozpočtovaných příjmů je nulová");
		if(!this.budget.incomeAmount) this.emit("warning","Celková výše příjmů je nulová");
		
		this.emit("budget",this.budget);
		
		let data = {
			budget: this.budget,
			events: this.events,
			payments: this.payments
		}
		
		cb(null,data);		
	}
			
	
	/* INTERFACE functions */
	
	writeEvent(event) {
		
		if(!event.name || !event.name.trim()) { this.emit("warning","Akce č. " + event.srcId + ": Neuveden název, záznam byl ignorován."); return; }

		if(this.eventIndex[event.srcId]) return;
		
		this.eventIndex[event.srcId] = {
			_id: mongoose.Types.ObjectId(),
			profile: this.etl.profile,
			year: this.etl.year,
			etl: this.etl._id,
			srcId: event.srcId,
			name: event.name,
			description: event.description,
			gps: event.gpsY && event.gpsX ? [ event.gpsY, event.gpsX] : null,
			items: [],
			paragraphs: [],
			budgetExpenditureAmount: 0,
			expenditureAmount: 0,
			budgetIncomeAmount: 0,
			incomeAmount: 0
		};

		this.events.push(this.eventIndex[event.srcId]);
		
		this.emit("event",this.eventIndex[event.srcId]);

	}

	writeBalance(balance){
		
		this.i++;
		
		let r = balance;
		
		let id = r.id || ("#" + this.i);

		let isIncome = Number(r.item) < 5000;
		let isOutcome = Number(r.item) >= 5000;

		r.amount = this.string2number(r.amount);

		/* REPORT ERRORS */
		// critical errors, skip item
		if(isNaN(r.amount)) { this.emit("warning","Záznam " + id + ": Nečitelná částka, záznam byl ignorován."); return; }
		if(!r.item) { this.emit("warning","Záznam " + id + ": Neuvedena rozpočtová položka, záznam byl ignorován."); return; }
		if(!isOutcome && !isIncome) { this.emit("warning","Záznam " + id + ": Nelze určit zda se jedná o příjem či výdaj."); return; }
		if(!r.paragraph && isOutcome) { this.emit("warning","Záznam " + id + ": Neuveden paragraf u výdajové položky. Záznam byl ignorován."); return; }

		// noncritical errors
		if(!r.type) this.emit("warning","Záznam " + id + ": Neuveden typ záznamu.");
		if(r.amount === 0) this.emit("warning","Záznam " + id + ": Nulová částka.");
		if(!r.item) this.emit("warning","Záznam " + id + ": Neuvedena rozpočtová položka.");
		

		/* UPDATE AMOUNTS */
		let budget = this.budget;
		let event = this.eventIndex[r.event];

		if(isIncome){

			let budgetItem = this.getBudgetItem(r.item);
			let budgetItemEvent = event ? this.getBudgetItemEvent(budgetItem,event) : null;
			let eventItem = event ? this.getEventBudgetItem(event, r.item) : null;
			
			let targetAccount = r.type === "ROZ" ? "budgetIncomeAmount" : "incomeAmount";

			this.assignAmount([budget, event, budgetItem, budgetItemEvent, eventItem], targetAccount, r.amount);
		}

		else if(isOutcome){

			let budgetParagraph = this.getBudgetParagraph(r.paragraph);
			let budgetParagraphEvent = event ? this.getBudgetParagraphEvent(budgetParagraph,event) : null;
			let eventParagraph = event ? this.getEventBudgetParagraph(event, r.paragraph) : null;
			
			let targetAccount = r.type === "ROZ" ? "budgetExpenditureAmount" : "expenditureAmount";

			this.assignAmount([budget, event, budgetParagraph, budgetParagraphEvent, eventParagraph], targetAccount, r.amount);
		}
	}

	/* SAVE PAYMENT IF APPLICABLE */
	writePayment(payment){
		
		if(!payment.date) this.emit("warning","Záznam " + payment.id + ": Neuvedeno datum u platby.");
		if(payment.counterpartyId && !payment.counterpartyName) this.emit("warning","Záznam " + payment.id + ": Neuvedeno jméno dodavatele u platby.");
		
		let event = this.eventIndex[payment.event];
		
		this.payments.push({
			profile: this.etl.profile,
			year: this.etl.year,
			etl: this.etl._id,
			event: event ? event._id : null,
			type: payment.type,
			item: payment.item,
			paragraph: payment.paragraph,
			date: this.string2date(payment.date),
			amount: this.string2number(payment.amount),
			counterpartyId: payment.counterpartyId,
			counterpartyName: payment.counterpartyName,
			description: payment.description
		});
		
		this.emit("payment",this.payment);
		
	}
	

	
	/* HELPER functions */

	string2number(string){
		if(!isNaN(string)) return Number(string);
		if(!string) return 0;
		if(string.charAt(string.length - 1) === "-") string = "-" + string.substring(0,string.length - 1); // sometimes minus is at the end, put it to first character
		string.replace(",","."); // function Number accepts only dot as decimal point
		return parseFloat(string);
	}

	string2date(string){
		if(!string) return null;
		// 29. 3. 1989, 29. 03. 1989, 29.3.1989, 29.03.1989 
		string = string.replace(/^([0-3]?[0-9])\. ?([01]?[0-9])\. ?([0-9]{4})$/,"$3-$2-$1");
		return new Date(string);		
	}

	
	
	
	/* TRANFROMATION */
	
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

	getBudgetItemEvent(budgetItem,event){
		var id = budgetItem.id + "-" + event._id;

		if (!this.budgetItemEventIndex[id]) {

			var budgetItemEvent = {
				event: event._id,
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

	getBudgetParagraphEvent(budgetParagraph,event){
		var id = budgetParagraph.id + "-" + event._id;

		if (!this.budgetParagraphEventIndex[id]) {

			var budgetParagraphEvent = {
				event: event._id,
				budgetExpenditureAmount: 0,
				expenditureAmount: 0
			};

			budgetParagraph.events.push(budgetParagraphEvent);
			this.budgetParagraphEventIndex[id] = budgetParagraphEvent;
		}
		return this.budgetParagraphEventIndex[id];
	}

	getEventBudgetParagraph(event, paragraphId) {
		var ebpId = event._id + "-" + paragraphId;

		if (!this.eventParagraphIndex[ebpId]) {

			var eventParagraph = {
				id: paragraphId,
				budgetExpenditureAmount: 0,
				expenditureAmount: 0			
			};

			event.paragraphs.push(eventParagraph);
			this.eventParagraphIndex[ebpId] = eventParagraph;
		}

		return this.eventParagraphIndex[ebpId];
	}

	getEventBudgetItem(event, itemId) {
		var id = event._id + "-" + itemId;

		if (!this.eventItemIndex[id]) {

			var eventItem = {
				id: itemId,
				budgetExpenditureAmount: 0,
				budgetIncomeAmount: 0,
				expenditureAmount: 0,
				incomeAmount: 0
			};

			event.items.push(eventItem);
			this.eventItemIndex[id] = eventItem;
		}

		return this.eventItemIndex[id];
	}

	assignAmount(targets,property,amount){
		targets.forEach(target => {
			if(!target) return;
			if(!target[property]) target[property] = 0;
			target[property] += amount;
		});
	}


}

module.exports = ImportTransformer;