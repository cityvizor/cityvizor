import { Injectable, EventEmitter } from '@angular/core';
import { Papa } from 'ngx-papaparse';
/* DEMO DATA SERVICE */

@Injectable()
export class DemoDataService {

	public profile: any = {
		_id: "abc",
		name: "Moje obec"
	};

	public year: number;

	public events: any[] = [];
	public eventIndex: any = {};

	public budget: any = {};

	public payments: any[] = [];

	public warnings:string[] = [];

	constructor(private papa: Papa) {
		this.year = (new Date()).getFullYear();
		this.loadLocalStorage();
	}

	loadLocalStorage() {
		this.budget = JSON.parse(localStorage.getItem("budget")) || {};
		this.events = JSON.parse(localStorage.getItem("events")) || [];
		this.payments = JSON.parse(localStorage.getItem("payments")) || [];
		this.eventIndex = this.events.reduce((acc, event) => { acc[event._id] = event; return acc; }, {})
	}

	saveLocalStorage() {
		localStorage.setItem("budget", JSON.stringify(this.budget));
		localStorage.setItem("events", JSON.stringify(this.events));
		localStorage.setItem("payments", JSON.stringify(this.payments));
	}

	async getProfile(profileId) {
		return this.profile;
	}

	async saveProfileBudget(eventsFile, dataFile, placeHolder) { // placeHolder to match definition of DataService
		var importer = new DemoImporter(this.year);
		var parser = new DemoParser(this.papa, importer);

		this.warnings = [];

		importer.subscribe((message: string) => this.warnings.push(message));

		await parser.parseEvents(eventsFile)

		await parser.parseData(dataFile);

		this.budget = importer.budget;
		this.events = importer.events;
		this.eventIndex = importer.eventIndex;
		this.payments = importer.payments;

		this.saveLocalStorage();
	}

	async getProfileBudget(profileId, year) {
		return this.budget;
	}
	async getProfileBudgets(profileId, options?) {
		return [this.budget];
	}

	async getEvent(eventId: string) {
		let event = this.eventIndex[eventId];
		if (event) event.payments = this.payments.filter(item => item.event === eventId);
		return event;
	}

	async getProfileEvents(profileId, options?) {
		return this.events.filter(item => options.srcId ? item.srcId === options.srcId : true);
	}

	async getProfilePaymentsMonths(profileId) {
		return [];
	}

	async getProfilePayments(profileId, options?) {
		return {};
	}


	// ORIGINAL
	async getEvents(options?) {
		return [];
	}	

}

/* DEMO DATA SERVICE */

export class DemoParser {

	constructor(private papa, private importer: DemoImporter) {
	}

	parseEvents(eventsFile) {
		return new Promise((resolve, reject) => {

			if (!eventsFile) return resolve(this.importer);

			var c = 1;
			this.papa.parse(eventsFile, {
				header: true,
				step: (result, parser) => this.importer.writeEvent(result.data[0], c++),
				complete: (results, file) => resolve(this.importer),
				error: (err, file) => reject(err)
			});

		});
	}

	parseData(dataFile) {

		return new Promise((resolve, reject) => {

			var c = 0;

			this.papa.parse(dataFile, {
				header: true,
				step: (result, parser) => {
					c++;
					let row = result.data[0];
					this.importer.writeBalance(row, c);
					if (row.type === "KDF" || row.type === "KOF") this.importer.writePayment(row, c);
				},
				complete: (results, file) => resolve(this.importer),
				error: (err, file) => reject(err)
			});


		});

	}
}

class DemoImporter extends EventEmitter<string>{

	year = (new Date()).getFullYear();
	profile = null;

	public budget: any = {
		etl: null,
		profile: null,
		year: this.year,
		budgetExpenditureAmount: 0,
		expenditureAmount: 0,
		budgetIncomeAmount: 0,
		incomeAmount: 0,
		items: [],
		paragraphs: []
	};

	public events: any[] = [];

	public payments: any[] = [];

	budgetItemIndex = {};
	budgetItemEventIndex = {};
	budgetParagraphIndex = {};
	budgetParagraphEventIndex = {};

	public eventIndex = {};
	eventItemIndex = {};
	eventParagraphIndex = {};

	constructor(year) {
		super();
		this.year = year;
		this.budget.year = this.year;
	}

	writeEvent(event, i: number) {

		if (!event.name || !event.name.trim()) { this.emit("Číselník akcí ř. " + i + ": Neuveden název, záznam byl ignorován."); return; }

		if (this.eventIndex[event.srcId]) return;

		this.eventIndex[event.srcId] = {
			_id: event.srcId,
			profile: this.profile,
			year: this.year,
			etl: null,
			srcId: event.srcId,
			name: event.name,
			description: event.description,
			gps: event.gpsY && event.gpsX ? [event.gpsY, event.gpsX] : null,
			items: [],
			paragraphs: [],
			budgetExpenditureAmount: 0,
			expenditureAmount: 0,
			budgetIncomeAmount: 0,
			incomeAmount: 0
		};

		this.events.push(this.eventIndex[event.srcId]);

	}

	writeBalance(balance, i: number) {

		let r = balance;

		let isIncome = Number(r.item) < 5000;
		let isOutcome = Number(r.item) >= 5000;

		r.amount = this.string2number(r.amount);

		/* REPORT ERRORS */
		// critical errors, skip item
		if (isNaN(r.amount)) { this.emit("Datový soubor ř. " + i + ": Nečitelná částka, záznam byl ignorován."); return; }
		if (!r.item) { this.emit("Datový soubor ř. " + i + ": Neuvedena rozpočtová položka, záznam byl ignorován."); return; }
		if (!isOutcome && !isIncome) { this.emit("Datový soubor ř. " + i + ": Nelze určit zda se jedná o příjem či výdaj."); return; }
		if (!r.paragraph && isOutcome) { this.emit("Datový soubor ř. " + i + ": Neuveden paragraf u výdajové položky. Záznam byl ignorován."); return; }

		// noncritical errors
		if (!r.type) this.emit("Datový soubor ř. " + i + ": Neuveden typ záznamu.");
		if (r.amount === 0) this.emit("Datový soubor ř. " + i + ": Nulová částka.");
		if (!r.item) this.emit("Datový soubor ř. " + i + ": Neuvedena rozpočtová položka.");

		/* UPDATE AMOUNTS */
		let budget = this.budget;
		let event = this.eventIndex[r.event];

		if (isIncome) {

			let budgetItem = this.getBudgetItem(r.item);
			let budgetItemEvent = event ? this.getBudgetItemEvent(budgetItem, event) : null;
			let eventItem = event ? this.getEventBudgetItem(event, r.item) : null;

			let targetAccount = r.type === "ROZ" ? "budgetIncomeAmount" : "incomeAmount";

			this.assignAmount([budget, event, budgetItem, budgetItemEvent, eventItem], targetAccount, r.amount);
		}

		else if (isOutcome) {

			let budgetParagraph = this.getBudgetParagraph(r.paragraph);
			let budgetParagraphEvent = event ? this.getBudgetParagraphEvent(budgetParagraph, event) : null;
			let eventParagraph = event ? this.getEventBudgetParagraph(event, r.paragraph) : null;

			let targetAccount = r.type === "ROZ" ? "budgetExpenditureAmount" : "expenditureAmount";

			this.assignAmount([budget, event, budgetParagraph, budgetParagraphEvent, eventParagraph], targetAccount, r.amount);
		}
	}

	/* SAVE PAYMENT IF APPLICABLE */
	writePayment(payment, i: number) {

		if (!payment.date) this.emit("Datový soubor ř. " + i + ": Neuvedeno datum u platby.");
		if (payment.counterpartyId && !payment.counterpartyName) this.emit("Datový soubor ř. " + i + ": Neuvedeno jméno dodavatele u platby.");

		let event = this.eventIndex[payment.event];

		this.payments.push({
			profile: this.profile,
			year: this.year,
			etl: null,
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
	}

	string2number(string) {
		if (!isNaN(string)) return Number(string);
		if (!string) return 0;
		if (string.charAt(string.length - 1) === "-") string = "-" + string.substring(0, string.length - 1); // sometimes minus is at the end, put it to first character
		string.replace(",", "."); // function Number accepts only dot as decimal point
		return parseFloat(string);
	}

	string2date(string) {
		if (!string) return null;
		// 29. 3. 1989, 29. 03. 1989, 29.3.1989, 29.03.1989 
		string = string.replace(/^([0-3]?[0-9])\. ?([01]?[0-9])\. ?([0-9]{4})$/, "$3-$2-$1");
		return new Date(string);
	}

	/**
		* get budget item object. in case it doesnt exist, create it and make a record in item index
		**/
	getBudgetItem(itemId) {

		if (!this.budgetItemIndex[itemId]) {
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

	getBudgetItemEvent(budgetItem, event) {
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

		if (!this.budgetParagraphIndex[paragraphId]) {
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

	getBudgetParagraphEvent(budgetParagraph, event) {
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

	assignAmount(targets, property, amount) {
		targets.forEach(target => {
			if (!target) return;
			if (!target[property]) target[property] = 0;
			target[property] += amount;
		});
	}


}