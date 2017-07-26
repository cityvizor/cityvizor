import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

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
	styleUrls: ['event-detail.style.css']
})
export class EventDetailComponent implements OnChanges {
	
	/* DATA */
	@Input()
	eventid:string;
	
	@Input()
	openTab:string;
	
	event:any;
	
	history:any[];

	counterparties:any = {};
	
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
			
				this.dataService.getProfileEvents(event.profile, {srcId:event.srcId})
					.then(events => this.history = events)
					.catch(err => console.log(err));
			
				this.setCounterparties();
			})
			.catch(err => console.log(err));
		
	}

	setCounterparties(){
		
		this.counterparties = {};
		
		this.event.payments.forEach(payment => {
			
			var id = payment.counterpartyId || payment.counterpartyName;
			
			if(!this.counterparties[id]) {
				this.counterparties[id] = {
					id: payment.counterpartyId,
					name: payment.counterpartyName,
					incomes: [],
					expenditures: [],
					sums: {incomes: 0, expenditures: 0, saldo: 0, saldoAbsolute: 0}
				}
			}
			
			if(payment.item < 5000) {
				this.counterparties[id].incomes.push(payment);
				this.counterparties[id].sums.incomes += payment.amount;
			}
			if(payment.item >= 5000) {
				this.counterparties[id].expenditures.push(payment);
				this.counterparties[id].sums.expenditures += payment.amount;
			}
			
			this.counterparties[id].sums.saldo = this.counterparties[id].sums.incomes - this.counterparties[id].sums.expenditures;
			this.counterparties[id].sums.saldoAbsolute = Math.abs(this.counterparties[id].sums.saldo);
			
		});
	}

}