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
	event;
	
	paragraphNames = paragraphNames;
	itemNames = itemNames;

}