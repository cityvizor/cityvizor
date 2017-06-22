import { Component, Input, ViewChild } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap';

import { DataService } from '../../services/data.service';
import { ToastService } 		from '../../services/toast.service';

@Component({
	moduleId: module.id,
	selector: 'expenditure-events',
	templateUrl: 'expenditure-events.template.html',
	styleUrls: ['expenditure-events.style.css'],
})
export class ExpenditureEventsComponent {

	/* DATA */
	@Input()
	set profile(profile: any ){
		this.profileId = profile._id;
		if(profile) this.loadData(profile._id,this.year);
	}
	
	profileId;
	
	year: number = (new Date()).getFullYear();

	@ViewChild('eventReceiptsModal')
	public eventReceiptsModal:ModalDirective;

	events: any[];

	openedEvent: any = null;

	infoWindowClosed:boolean;
		 
	maxEEAmount = 0;
	 
	nazvyMesice = ["leden","únor","březen","duben","květen","červen","červenec","srpen","září","říjen","listopad","prosinec"];	 

	constructor(private dataService:DataService, private toastService:ToastService) { }

	loadData(profileId,year){
		 
		this.dataService.getProfileEvents(this.profileId,{sort:"name",year:year})
			.then(events => this.events = events)
			.catch(err => {
				this.events = [];
				this.toastService.toast("Nastala chyba při stahování akcí.","error");
			});			
		 
	}
	 
	openEvent(event){

		this.eventReceiptsModal.show();
		
		this.openedEvent = event._id;
		
	}

}