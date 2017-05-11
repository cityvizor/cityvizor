import { Component, Input } from '@angular/core';

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
export class EventDetailComponent{
	
	/* DATA */
	@Input()
	set event(event){
		if(event) this.setData(event);		
	};
	
	budgets:any[];
	counterparties:any = {};
	
	paragraphNames = paragraphNames;
	itemNames = itemNames;

	setData(event){
		this.budgets = event.budgets;
		
		this.counterparties = {};
		
		event.payments.forEach(payment => {
			
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