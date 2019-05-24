const EventEmitter = require('events');

const mongoose = require("mongoose");

class ImportTransformer extends EventEmitter {

	constructor(etl,dataSource){
    
		super();
		
		this.etl = etl;

    dataSource.on("event", event => this.writeEvent(event));
    dataSource.on("counterparty", counterparty => this.writeCounterparty(counterparty));
    dataSource.on("balance", balance => this.writeBalance(balance));
    dataSource.on("payment", payment => this.writePayment(payment));
		
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
    
    this.counterparties = [];
		this.counterpartyIndex = {};
		
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
      counterparties: this.counterparties,
			payments: this.payments
		}
		
		cb(null,data);		
	}
			
	
	/* INTERFACE functions */
	
	writeEvent(event) {
		
		if(!event.id) { this.emit("warning","Akce: Neuvedeno číslo akce, záznam byl ignorován."); return; }
		if(!event.name || !event.name.trim()) { this.emit("warning","Akce č. " + event.id + ": Neuveden název, záznam byl ignorován."); return; }
		

		if(this.eventIndex[event.id]) return;
		
		this.eventIndex[event.id] = {
			_id: mongoose.Types.ObjectId(),
			profile: this.etl.profile,
			year: this.etl.year,
			etl: this.etl._id,
			srcId: event.id,
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

		this.events.push(this.eventIndex[event.id]);
		
		this.emit("event",this.eventIndex[event.id]);

	}
  
  writeCounterparty(counterparty) {
    
		if(this.counterpartyIndex[counterparty.counterpartyId]) return;
		
		this.counterpartyIndex[counterparty.counterpartyId] = {
			_id: mongoose.Types.ObjectId(),
			profile: this.etl.profile,
			year: this.etl.year,
			etl: this.etl._id,
			counterpartyId: counterparty.counterpartyId,
			name: counterparty.counterpartyName,
      budgetExpenditureAmount: 0,
      budgetIncomeAmount: 0,
      expenditureAmount: 0,
      incomeAmount: 0
		};

		this.counterparties.push(this.counterpartyIndex[counterparty.counterpartyId]);
    
    
		
		this.emit("counterparty",this.counterpartyIndex[counterparty.counterpartyId]);

	}

	writeBalance(balance){
		
		this.i++;
		
		let r = balance;
		
		let id = r.id || ("#" + this.i);

		let isIncome = (Number(r.item) >= 1000 && Number(r.item) < 5000) || (Number(r.item) >= 8000 && Number(r.item) < 9000);
		let isOutcome = Number(r.item) >= 5000 && Number(r.item) < 8000;

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
		let event = this.eventIndex[r.eventId];
    let counterparty = this.counterpartyIndex[r.counterpartyId];

		if(isIncome){

			let budgetItem = this.getBudgetItem(r.item);
			let budgetItemEvent = event ? this.getBudgetItemEvent(budgetItem,event) : null;
			let eventItem = event ? this.getEventBudgetItem(event, r.item) : null;
			
			let targetAccount = r.type === "ROZ" ? "budgetIncomeAmount" : "incomeAmount";

			this.assignAmount([budget, event, counterparty, budgetItem, budgetItemEvent, eventItem], targetAccount, r.amount);
		}

		else if(isOutcome){

			let budgetParagraph = this.getBudgetParagraph(r.paragraph);
			let budgetParagraphEvent = event ? this.getBudgetParagraphEvent(budgetParagraph,event) : null;
			let eventParagraph = event ? this.getEventBudgetParagraph(event, r.paragraph) : null;
			
			let targetAccount = r.type === "ROZ" ? "budgetExpenditureAmount" : "expenditureAmount";

			this.assignAmount([budget, event, counterparty, budgetParagraph, budgetParagraphEvent, eventParagraph], targetAccount, r.amount);
		}
	}

	/* SAVE PAYMENT IF APPLICABLE */
	writePayment(payment){
		
		if(!payment.date) this.emit("warning","Záznam " + payment.id + ": Neuvedeno datum u platby.");
		if(payment.counterpartyId && !payment.counterpartyName) this.emit("warning","Záznam " + payment.id + ": Neuvedeno jméno dodavatele u platby.");
		
		let event = this.eventIndex[payment.eventId];
		
		let description = String(payment.description).replace("\\n","\n").split(/[\r\n]+/)[0];
		
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
			description: description
		});
		
		this.emit("payment",this.payment);
		
	}
	
	
	/* HELPER functions */

	string2number(string){
		
		if(typeof string === "number") return string;
		
		if(!string || !string.length) return 0;
		
		if(string.charAt(string.length - 1) === "-") string = "-" + string.substring(0,string.length - 1); // sometimes minus is at the end, put it to first character
		
		string = string.replace(",",".");
		
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