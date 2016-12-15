var Transform = require('stream').Transform;

module.exports = class ExpenditureTransformer extends Transform {

	constructor(ico,year) {
		super({objectMode:true});
		this.ico = ico;
		this.year = year;
		this.reset();
	}

	reset(){
		
		this.events = [];
		
		this.budget = {
			ico: this.ico,
			year: this.year,
			expenditureAmount: 0,
			budgetAmount: 0,
			paragraphs: []
		}
		
		this.i = 0;

		this.paragraphIndex = {};
		this.eventIndex = {};
		this.eventParagraphIndex = {};
		this.paragraphEventIndex = {};
	}

	getParagraph(paragraphId) {
		if (!this.paragraphIndex[paragraphId]) {
			var paragraph = {
				id: paragraphId,
				name: "nazev paragrafu",
				expenditureAmount: 0,
				budgetAmount: 0,
				events: []
			};
			this.budget.paragraphs.push(paragraph);
			this.paragraphIndex[paragraphId] = paragraph;
		}
		return this.paragraphIndex[paragraphId];
	}

	getEvent(eventId, eventName) {
		if (!this.eventIndex[eventId]) {
			var event = {
				id: eventId,
				name: eventName,
				yearData:[{
					year: this.year,
					paragraphs: [],
					expenditureAmount: 0,
					budgetAmount: 0
				}],
				gps: null
			};
			this.events.push(event);
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
			event.yearData[0].paragraphs.push(paragraph);
			this.eventParagraphIndex[epId] = paragraph;
		}
		return this.eventParagraphIndex[epId];
	}
	
	getParagraphEvent(paragraph,event){
		var epId = paragraph.id + "-" + event.id;
		if (!this.paragraphEventIndex[epId]) {
			var eventData = {
				id: event.id,
				name: event.name,
				expenditureAmount: 0,
				budgetAmount: 0
			};
			paragraph.events.push(eventData);
			this.paragraphEventIndex[epId] = eventData;
		}
		return this.paragraphEventIndex[epId];
	}
	
	string2number(string){
		if(string.charAt(string.length - 1) === "-") string = "-" + string.substring(0,string.length - 1); //sometimes minus is at the end, put it to first character
		string.replace(",","."); // function Number accepts only dot as decimal point
		return Number(string);
	}

	_flush(next) {
		
		console.log("FLUSH Events: " + this.events.length);
		
		this.push({budget:this.budget,events:this.events});
		this.reset();
		next();
	}

	_write(item, enc, next) {		
		
		this.i++;
		
		if(item.length < 9){next();return;} // invalid row
		if(this.i === 1){next();return;}

		var paragraphId = item[0];
		var budgetItemId = item[4];
		
		var budget = this.budget;

		var paragraph = this.getParagraph(paragraphId);

		var event = this.getEvent(item[1], item[2]);
		var eventParagraph = this.getEventParagraph(event, paragraphId);
		
		var paragraphEvent = this.getParagraphEvent(paragraph,event);
		
		var amount;

		/* Expenditure amount */
		amount = this.string2number(item[6]);

		[budget, paragraph, event.yearData[0], eventParagraph, paragraphEvent].map(item => item.expenditureAmount += amount);

		/* Budget amount */
		amount = this.string2number(item[8]);

		[budget, paragraph, event.yearData[0], eventParagraph, paragraphEvent].map(item => item.budgetAmount += amount);

		next();
	}
}