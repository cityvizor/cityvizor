import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { DataService } from '../../services/data.service';

import { paragraphNames } from '../../shared/data/paragraph-names.data';
import { itemNames } from '../../shared/data/item-names.data';

/*

Component for graphical vizualization of event

*/
@Component({
	moduleId: module.id,
	selector: 'event-detail',
	templateUrl: 'event-detail.template.html',
	styleUrls: ['event-detail.style.css'],
	animations: [
		trigger('paymentsState', [
			state('closed', style({display:'none',opacity:0})),
			state('open', style({display:'block',opacity:1})),
			transition('closed => open', [style({height:0}),animate('250ms ease-in',style({opacity:1,height:'*'}))]),
			transition('open => closed', animate('250ms ease-out',style({opacity:0,height:0})))
		])
	]
})
export class EventDetailComponent implements OnChanges {
	
	/* DATA */
	@Input()
	eventid:string;
	
	@Input()
	openTab:string;
	
	@Output()
	selectEvent:EventEmitter<string> = new EventEmitter();
	
	event:any;
	
	history:any[];
	maxHistoryAmount:number = 0;
	
	counterparties:any[] = [];
	otherPayments:any = {payments: [],total: 0, open: false};
	paymentsIncomeAmount:number = 0;
	paymentsExpenditureAmount:number = 0;
	
	paragraphNames = paragraphNames;
	itemNames = itemNames;
	
	constructor(private dataService:DataService){}
	
	ngOnChanges(changes:SimpleChanges){
		if(changes.eventid && this.eventid) this.loadBudget(this.eventid);
	}

	loadBudget(eventId){
		this.event = null;
		
		this.dataService.getEvent(eventId)
			.then(event => {
				
				this.event = event;
			
				this.event.items.sort((a,b) => a.id - b.id);
				this.event.paragraphs.sort((a,b) => a.id - b.id);
			
				// get event accross years;
				this.dataService.getProfileEvents(event.profile, {srcId:event.srcId,sort: "year"})
					.then(events => {
						this.history = events;
						this.maxHistoryAmount = 0;
						this.history.forEach(historyEvent => {
							this.maxHistoryAmount = Math.max(this.maxHistoryAmount,historyEvent.expenditureAmount | 0,historyEvent.incomeAmount | 0,historyEvent.budgetExpenditureAmount | 0,historyEvent.budgetIncomeAmount | 0)
						});
					
					})
					.catch(err => console.log(err));
			
				this.parsePayments();
			})
			.catch(err => console.log(err));
		
	}

	parsePayments(){
		
		this.counterparties = [];
		this.paymentsIncomeAmount = this.paymentsExpenditureAmount = 0;
		
		let otherPayments = null;
		let counterpartyIndex = {};
		
		this.event.payments.forEach(payment => {
			
			// sum up all the payments and invoices
			if(payment.item < 5000) this.paymentsIncomeAmount += payment.amount;
			else this.paymentsExpenditureAmount += payment.amount;
			
			var id = payment.counterpartyId || payment.counterpartyName;

			var counterparty;
			
			if(id){
				if(!counterpartyIndex[id]) {
					let newCounterparty = {
						id: payment.counterpartyId,
						name: payment.counterpartyName,
						payments: [],
						total: 0,
						open: false
					};
					counterpartyIndex[id] = newCounterparty;
					this.counterparties.push(newCounterparty);
				}
				
				counterparty = counterpartyIndex[id];
				
			}
			else{
				if(!otherPayments){
					otherPayments = {
						name: "Jiné platby",
						payments: [],
						total: 0,
						open: false
					};
					this.counterparties.push(otherPayments);
				}
				
				counterparty = otherPayments;
			}
			
			if(payment.item < 5000) counterparty.total += payment.amount;
			else if(payment.item >= 5000) counterparty.total -= payment.amount;
			counterparty.payments.push(payment);	

		});
		
		this.counterparties.sort((a,b) => a.total - b.total);
		this.counterparties.forEach(counterparty => counterparty.payments.sort((a,b) => a.date - b.date));

	}
	
	openPayments(counterparty){		
		counterparty.open = !counterparty.open;
	}

}