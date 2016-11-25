var Transform = require('stream').Transform;

module.exports = class ExpenditureTransformer extends Transform {

	constructor(ico,year) {
		super({objectMode:true});
		this.ico = ico;
		this.year = year;
		this.reset();
	}

	reset() {
		this.data = {
			ico: this.ico,
			year: this.year,
			events: [],
			budget: {
				expenditureAmount: 0,
				budgetAmount: 0,
				paragraphs: [],
				groups:[]
			}
		}
		
		this.i = 0;

		this.paragraphIndex = {};
		this.groupIndex = {};
		this.eventIndex = {};
		this.eventParagraphIndex = {};
	}

	getGroup(paragraphId) {

		var groupId = paragraphId.substring(0, 2);

		if (!this.groupIndex[groupId]) {
			var group = {
				id: groupId,
				name: "nazev skupiny",
				expenditureAmount: 0,
				budgetAmount: 0
			};
			this.data.budget.groups.push(group);
			this.groupIndex[groupId] = group;
		}
		return this.groupIndex[groupId];
	}

	getParagraph(paragraphId) {
		if (!this.paragraphIndex[paragraphId]) {
			var paragraph = {
				id: paragraphId,
				name: "nazev paragrafu",
				expenditureAmount: 0,
				budgetAmount: 0
			};
			this.data.budget.paragraphs.push(paragraph);
			this.paragraphIndex[paragraphId] = paragraph;
		}
		return this.paragraphIndex[paragraphId];
	}

	getEvent(eventId, eventName) {
		if (!this.eventIndex[eventId]) {
			var event = {
				id: eventId,
				name: eventName,
				paragraphs: [],
				expenditureAmount: 0,
				budgetAmount: 0,
				gps: null
			};
			this.data.events.push(event);
			this.eventIndex[eventId] = event;
		}
		return this.eventIndex[eventId];
	}

	getEventParagraph(event, paragraphId) {
		var epId = event.id + "-" + paragraphId;
		if (!this.eventParagraphIndex[epId]) {
			var paragraph = {
				id: paragraphId,
				name: "nazev paragrafu",
				expenditureAmount: 0,
				budgetAmount: 0
			};
			event.paragraphs.push(paragraph);
			this.eventParagraphIndex[epId] = paragraph;
		}
		return this.eventParagraphIndex[epId];
	}
	
	string2number(string){
		if(string.charAt(string.length - 1) === "-") string = "-" + string.substring(0,string.length - 1); //sometimes minus is at the end, put it to first character
		string.replace(",","."); // function Number accepts only dot as decimal point
		return Number(string);																									
	}

	_flush(next) {
		this.push(this.data);
		this.reset();
		next();
	}

	_write(item, enc, next) {
		
		this.i++;
		
		if(item.length < 9){next();return;} // invalid row
		if(this.i === 1){next();return;}
		
		var budget = this.data.budget;

		var paragraphId = item[0];
		var budgetItemId = item[4];

		var group = this.getGroup(paragraphId);
		var paragraph = this.getParagraph(paragraphId);

		var expenditureEvent = this.getEvent(item[1], item[2]);
		var expenditureEventParagraph = this.getEventParagraph(expenditureEvent, paragraphId);
		
		var amount;

		/* Expenditure amount */
		amount = this.string2number(item[6]);

		[budget, group, paragraph, expenditureEvent, expenditureEventParagraph].map(item => item.expenditureAmount += amount);

		//if (group.expenditureAmount > data.maxExpenditureAmount) data.maxExpenditureAmount = group.expenditureAmount;
		//if (paragraph.expenditureAmount > group.maxExpenditureAmount) group.maxExpenditureAmount = paragraph.expenditureAmount;

		/* Budget amount */
		amount = this.string2number(item[8]);

		[budget, group, paragraph, expenditureEvent, expenditureEventParagraph].map(item => item.budgetAmount += amount);

		//if (group.budgetAmount > data.maxBudgetAmount) data.maxBudgetAmount = group.budgetAmount;
		//if (paragraph.budgetAmount > group.maxBudgetAmount) group.maxBudgetAmount = paragraph.budgetAmount;

		next();
	}
}