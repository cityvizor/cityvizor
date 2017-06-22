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
					expenditures: []
				}
			}
			
			if(payment.item < 5000) this.counterparties[id].incomes.push(payment);
			if(payment.item >= 5000) this.counterparties[id].expenditures.push(payment);
			
		});
	}

}