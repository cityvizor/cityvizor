import { Component, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/ng2-bootstrap';

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
		if(profile) this.loadData(profile._id);
	}
	
	profileId;

	@ViewChild('eventReceiptsModal')
	public eventReceiptsModal:ModalDirective;

	events: any[];

	openedEvent: any = null;
		 
	viewOptions = {
		"dateOfFirst":new Date(2016,1,1),
		"dateOfLast":new Date(2016,12,31),
		"zoom":"year",
		"amountBubbleMaxSize":200,
		"amountBubbleMinSize":50
	}; 
	 
	nazvyMesice = ["leden","únor","březen","duben","květen","červen","červenec","srpen","září","říjen","listopad","prosinec"];	 

	constructor(private dataService:DataService, private toastService:ToastService) { }

	loadData(profileId){
		 
		this.dataService.getEvents(profileId)
			.then(events => this.events = events)
			.catch(err => {
				this.events = [];
				this.toastService.toast("Nastala chyba při stahování akcí.","error");
			});
		 
	 }
	 
	getDateRangeFrac (date) {
		if(!date) return 0;
		var frac = (date.getTime() - this.viewOptions.dateOfFirst.getTime()) / ( this.viewOptions.dateOfLast.getTime() - this.viewOptions.dateOfFirst.getTime() );
		frac = Math.min(1,Math.max(0,frac));
		return frac;
	}
/*
	getDateEventRangeFracPercent (event,date) {
		var frac = (date.getTime() - event.from.getTime()) / event.till.getTime() - event.from.getTime();
		frac = Math.min(1,Math.max(0,frac))*100;
		return frac;
	}
	*/
	 
	getAmountBubbleSize(amount) {
		return this.viewOptions.amountBubbleMinSize + (this.viewOptions.amountBubbleMaxSize - this.viewOptions.amountBubbleMinSize ) * amount / 100; //this.maxLoremEESumAmount;
	}
	getExpenditureAmountBubbleSize(ee,amount) {
		return this.viewOptions.amountBubbleMinSize + (this.viewOptions.amountBubbleMaxSize - this.viewOptions.amountBubbleMinSize ) * amount / ee.sumAmount;
	}
	 
	isOverlapToPast(date) {
		var now = date;
		if (now<this.viewOptions.dateOfFirst) return true;
		else return false;
	}
	isOverlapToFuture(date) {
		var now = date;
		if (now > this.viewOptions.dateOfLast) return true;
		else return false;
	}
	 
	openEvent(event){
		
		this.openedEvent = null;
		this.eventReceiptsModal.show();
		
		this.dataService.getProfileEvent(this.profileId,event.id)
			.then(eventData => this.openedEvent = eventData)
			.catch(err => {
				this.eventReceiptsModal.hide();
				this.toastService.toast("Nastala chyba při stahování údajů o akci. " + err.message,"error");
			});
	}

}