var fs = require("fs");
var parse = require("csv-parse");

var mongoose = require("mongoose");
var ExpendituresSchema = require("../../models/expenditures");
var Budget = ExpendituresSchema.Budget;
var Event = ExpendituresSchema.Event;
var Payment = ExpendituresSchema.Payment;

var importConfig = require("../../config/import-config.js");

class BudgetImporter {

	import(importData){

		// return promise
		return new Promise((resolve,reject) => {

			// check params
			if(!importData.profileId) return reject(new Error("Missing profileId parameter"));
			if(!importData.year) return reject(new Error("Missing year parameter"));

			/* IMPORT VARIABLES */
			this.warnings = [];
			this.counter = {};

			/* IMPORT TASKS */
			var tasks = [];

			tasks.push(() => this.importEvents(importData));

			tasks.push(() => this.importExpenditures(importData));

			tasks.push(() => this.save(importData));

			this.importLoop(tasks,(err) => {

				if(err) return reject(err);

				let result = {
					counter: this.counter,
					warnings: this.warnings
				};

				resolve(result);

			});

		});

	}

	importLoop(tasks,cb){
		let task = tasks.shift();

		if(!task) return cb();

		task().then(() => this.importLoop(tasks,cb)).catch(err => cb(err));
	}

	importEvents(importData) {

		return new Promise((resolve,reject) => {

			// prepare variables
			var headerMap = {};

			this.events = [];

			// stream to read the uploaded file
			var file = fs.createReadStream(importData.eventsFile);
			file.on("error",err => reject(err));

			// stream to parse CSV
			var parser = parse({delimiter: ';',trim:true});

			parser.on("data", line => {

				if(parser.count === 1){
					headerMap = this.makeHeaderMap("events",line);
					return;
				}

				let h = headerMap;

				this.events.push({
					_id: mongoose.Types.ObjectId(),
					profile: importData.profileId,
					year: Number(importData.year),
					srcId: line[h.srcId],
					name: line[h.name],
					description: line[h.description],
					gps: line[h.gpsY] && line[h.gpsX] ? [ line[h.gpsY], line[h.gpsX] ] : null,
					items: [],
					paragraphs: [],
					budgetExpenditureAmount: 0,
					expenditureAmount: 0,
					budgetIncomeAmount: 0,
					incomeAmount: 0
				});

			});

			parser.on("error",err => reject(err));

			parser.on("end",() => {

				this.counter.events = parser.count;

				if(!this.events.length) this.warnings.push("Data: Nulový počet investičních akcí");

				resolve();
			});

			file.pipe(parser);

		});
	}

	importExpenditures(importData){

		return new Promise((resolve,reject) => {

			var headerMap = {};

			this.payments = [];

			this.budget = {
				profile: importData.profileId,
				year: importData.year,
				validity: importData.validity,
				budgetExpenditureAmount: 0,
				expenditureAmount: 0,
				budgetIncomeAmount: 0,
				incomeAmount: 0,
				items: [],
				paragraphs: []
			};

			/* INDICES FOR FASTER LOOKUP */
			this.budgetItemIndex = {};
			this.budgetItemEventIndex = {};
			this.budgetParagraphIndex = {};
			this.budgetParagraphEventIndex = {};

			this.eventIndex = {};
			this.eventItemIndex = {};
			this.eventParagraphIndex = {};

			// fill events index
			this.events.forEach(event => this.eventIndex[event.srcId] = event);

			// Open the file and set automatic delete on file close (we dont want to save the file)
			var file = fs.createReadStream(importData.expendituresFile);
			file.on("error",err => reject(err));

			// Parser to parse CSV file
			var parser = parse({delimiter: ';', trim:true, relax_column_count:true});

			parser.on("error",err => reject(err));	

			parser.on("data",row => {

				if(parser.count === 1){
					headerMap = this.makeHeaderMap("data",row);
					return;
				}

				let i = parser.count;

				let h = headerMap;

				let itemId = row[h.item];
				let paragraphId = row[h.paragraph];
				let eventId = row[h.event];

				let recordType = row[h.recordType];
				let amountType = row[h.amountType];
				if(!amountType && itemId) amountType = Number(itemId) < 5000 ? "P" : (Number(itemId) >= 5000  ? "V" : null);

				let amount = this.string2number(row[h.amount]);

				/* REPORT ERRORS */
				// critical errors, skip item
				if(isNaN(amount)) { this.warnings.push("Data, řádek " + i + ": Nečitelná částka, záznam byl ignorován."); return; }
				if(!amountType) { this.warnings.push("Data, řádek " + i + ": Neuvedeno zda se jedná o příjem či výdej ani rozpočtová položka, záznam byl ignorován."); return; }

				// noncritical errors
				if(!recordType) this.warnings.push("Data, řádek " + i + ": Neuveden modul.");
				if(amount === 0) this.warnings.push("Data, řádek " + i + ": Nulová částka.");
				if(!itemId) this.warnings.push("Data, řádek " + i + ": Neuvedena rozpočtová položka.");
				if(!paragraphId && amountType === "V") this.warnings.push("Data, řádek " + i + ": Neuveden paragraf u výdajové položky.");
				if(!row[h.date]) this.warnings.push("Data, řádek " + i + ": Neuvedeno datum.");
				if(row[h.counterpartyId] && !row[h.counterpartyName]) this.warnings.push("Data, řádek " + i + ": Neuvedeno jméno dodavatele.");


				/* UPDATE AMOUNTS */
				let budget = this.budget;
				let event = this.eventIndex[eventId];

				if(amountType === "P"){

					let budgetItem = this.getBudgetItem(itemId);
					let budgetItemEvent = event ? this.getBudgetItemEvent(budgetItem,event) : null;
					let eventItem = event ? this.getEventBudgetItem(event, itemId) : null;

					this.assignAmount([budget, event, budgetItem, budgetItemEvent, eventItem],recordType === "ROZ" ? "budgetIncomeAmount" : "incomeAmount", amount);
				}

				else if(amountType === "V"){

					let budgetParagraph = this.getBudgetParagraph(paragraphId);
					let budgetParagraphEvent = event ? this.getBudgetParagraphEvent(budgetParagraph,event) : null;
					let eventParagraph = event ? this.getEventBudgetParagraph(event, paragraphId) : null;

					this.assignAmount([budget, event, budgetParagraph, budgetParagraphEvent, eventParagraph], recordType === "ROZ" ? "budgetExpenditureAmount" : "expenditureAmount", amount);
				}

				/* SAVE PAYMENT IF APPLICABLE */
				//if(row[h.counterpartyId] || recordType === "KDF" || row[h.description]){
				if(recordType === "KDF" || recordType === "KOF"){
					this.payments.push({
						profile: importData.profileId,
						year: importData.year,
						event: event ? event._id : null,
						type: recordType,
						item: itemId,
						paragraph: paragraphId,
						date: this.string2date(row[h.date]),
						amount: amount,
						counterpartyId: row[h.counterpartyId],
						counterpartyName: row[h.counterpartyName],
						description: row[h.description]
					});
				}

			});

			parser.on("end",() => {
				resolve();
			});

			// Launch the import by piping all the streams together
			file.pipe(parser)

		});

	}

	save(importData){
		return new Promise((resolve,reject) => {

			if(!this.budget.budgetExpenditureAmount) this.warnings.push("Data: Celková výše rozpočtovaných výdajů je nulová");
			if(!this.budget.expenditureAmount) this.warnings.push("Data: Celková výše výdajů je nulová");
			if(!this.budget.budgetIncomeAmount) this.warnings.push("Data: Celková výše rozpočtovaných příjmů je nulová");
			if(!this.budget.incomeAmount) this.warnings.push("Data: Celková výše příjmů je nulová");

			// Clear old data. We always replace entire year block of data. Data is intentionally partitioned in DB to make this easy.
			var clearOld = [];

			clearOld.push(Budget.remove({ profile: importData.profileId, year: importData.year }));
			clearOld.push(Event.remove({ profile: importData.profileId, year: importData.year }));
			clearOld.push(Payment.remove({ profile: importData.profileId, year: importData.year }));

			// After all clearing finished, launch the import
			Promise.all(clearOld)
				.then(values => {

				// TODO: If clearing fails, cancel import (and possibly revert???)
				// TODO: if(errs.some(item => item)) { }
				var save = [];

				save.push(Budget.create(this.budget));
				save.push(Event.insertMany(this.events));
				save.push(Payment.insertMany(this.payments));

				Promise.all(save)
					.then(() => {

					this.counter.budgets = 1;
					this.counter.events = this.events.length;
					this.counter.payments = this.payments.length;

					resolve();
				})
					.catch(err => reject(err));

			})
				.catch(err => reject(err));

		});
	}


	makeHeaderMap(headerType,header){

		let config = importConfig[headerType];

		let headerTypeNames = {"events":"Číselník investičních akcí","data":"Datový soubor"};

		let headerNames = config.headerNames;
		let mandatoryFields = config.mandatoryFields;
		let missingMandatory = [];

		var headerMap = {};

		Object.keys(headerNames).forEach(field => {

			let columnNames = headerNames[field];

			let search = columnNames.some(name => {
				headerMap[field] = header.indexOf(name);
				if(headerMap[field] >= 0) return true;
			});

			if(!search){
				if(config.mandatoryFields.indexOf(field) >= 0) missingMandatory.push(field);
				else this.warnings.push("Hlavička CSV - " + headerTypeNames[headerType] + ": Nenalezeno volitelné pole " + columnNames.join("/") + ".");
			}

		});

		if(missingMandatory.length > 0) {
			throw new Error("Hlavička CSV - " + headerTypeNames[headerType] + ": Nenalezena povinná pole " + missingMandatory.map(key => headerNames[key].join("/")).join(", ") + ".");
		}

		return headerMap;
	}

	string2number(string){
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

module.exports = BudgetImporter;