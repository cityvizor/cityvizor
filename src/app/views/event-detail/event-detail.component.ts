import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { DataService } from '../../services/data.service';
import { CodelistService } from '../../services/codelist.service';
import { ToastService } from '../../services/toast.service';

/*

Component for graphical vizualization of event

*/
@Component({
	moduleId: module.id,
	selector: 'event-detail',
	templateUrl: 'event-detail.component.html',
	styleUrls: ['event-detail.component.scss'],
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
	
	itemNames:any;
	paragraphNames:any;
	
	maxExpenditureAmount:number;
	maxIncomeAmount:number;
	
	history:any[];
	maxHistoryAmount:number = 0;
	
	counterparties:any[] = [];
	otherPayments:any = {payments: [],total: 0, open: false};
	
	constructor(private dataService:DataService, private codelistService:CodelistService, private toastService:ToastService){}
	
	ngOnChanges(changes:SimpleChanges){
		if(changes.eventid && this.eventid) this.loadEvent(this.eventid);
	}

	loadEvent(eventId){
		this.event = null;
		
		var queries = [
			this.dataService.getEvent(eventId),
			this.codelistService.getCodelist("paragraph-names"),
			this.codelistService.getCodelist("item-names")
		];
		
		Promise.all(queries)
			.then(values => {
			
				let event = values[0];
			
				var codelistDate = new Date(event.year,0,1);
			
				let paragraphNames = values[1].getIndex(codelistDate);
				let itemNames = values[2].getIndex(codelistDate);			
			
				event.items.forEach(item => item.name = itemNames[item.id] || "Položka č. " + item.id);
				event.paragraphs.forEach(paragraph => paragraph.name = paragraphNames[paragraph.id] || "Paragraf č. " + paragraph.id);
			
				event.items.sort((a,b) => a.id - b.id);
				event.paragraphs.sort((a,b) => a.id - b.id);
			
				this.maxExpenditureAmount = Math.max(event.expenditureAmount,event.budgetExpenditureAmount);
				this.maxIncomeAmount = Math.max(event.incomeAmount,event.budgetIncomeAmount);
			
				this.event = event;
			
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
	
	loadCodelists(date:Date){
		var queue = [];
		
		queue.push(this.codelistService.getCodelist("item-names"));
		queue.push(this.codelistService.getCodelist("paragraph-names"));
		
		Promise.all(queue)
			.then(values => {
				this.itemNames = values[0].getIndex(date);
				this.paragraphNames = values[1].getIndex(date);
			})
			.catch(err => this.toastService.toast("Chyba při načítání číselníků: " + err.message,"notice"));
	}

	parsePayments(){
		
		this.counterparties = [];
		this.event.paymentsIncomeAmount = this.event.paymentsExpenditureAmount = 0;
		
		let otherPayments = null;
		let counterpartyIndex = {};
		
		this.event.payments.forEach(payment => {
			
			// sum up all the payments and invoices
			if(payment.item < 5000) this.event.paymentsIncomeAmount += payment.amount;
			else this.event.paymentsExpenditureAmount += payment.amount;
			
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