import { Component, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';

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
	
	year: number = (new Date()).getFullYear();

	@ViewChild('eventReceiptsModal')
	public eventReceiptsModal:ModalDirective;

	events: any[];

	openedEvent: any = null;

	infoWindowClosed:boolean;
		 
	viewOptions = {
		"dateOfFirst":null,
		"dateOfLast":null,
		"dateFirst":null,
		"dateLast":null,
		"showingDays":0,
		"showingMonths":0,
		"startingMonth":0,
		"monthsArray":[],
		"zoom":"year",
		"amountBubbleMaxSize":200,
		"amountBubbleMinSize":50
	}; 

	maxEEAmount = 0;
	 
	nazvyMesice = ["leden","únor","březen","duben","květen","červen","červenec","srpen","září","říjen","listopad","prosinec"];	 

	constructor(private dataService:DataService, private toastService:ToastService) {
		
	}

	loadData(profileId){
		 
		this.dataService.getProfileEventsTimeline(this.profileId,this.year)
			.then(events => { 
				this.events = events;
				events.forEach(event => {
					if (this.maxEEAmount<event.amount) this.maxEEAmount=event.amount;
					if (this.viewOptions.dateFirst>event.dateFirst ||this.viewOptions.dateFirst===null) this.viewOptions.dateFirst=event.dateFirst;
					if (this.viewOptions.dateLast<event.dateLast || this.viewOptions.dateLast===null) this.viewOptions.dateLast=event.dateLast;
				});
			
				this.viewOptions.dateFirst = new Date(this.viewOptions.dateFirst);
				this.viewOptions.dateLast = new Date(this.viewOptions.dateLast);
				
			  this.viewOptions.showingDays = (this.viewOptions.dateLast.getTime()-this.viewOptions.dateFirst.getTime())/(1000*60*60*24);
				this.viewOptions.showingMonths = Math.round(this.viewOptions.showingDays/30);
				this.viewOptions.startingMonth = this.viewOptions.dateFirst.getMonth();
			
			  var i = this.viewOptions.startingMonth; 
				for ( ; i < (this.viewOptions.startingMonth+this.viewOptions.showingMonths); i++) {
					var ind = i % 12;
					this.viewOptions.monthsArray.push(this.nazvyMesice[ind]);
				}
			
				console.log(this.viewOptions);
			}).catch(err => {
				this.events = [];
				this.toastService.toast("Nastala chyba při stahování akcí.","error");
			});
		 
	 }
	
	EventBarFrac (event) {
		var frac =event.amount/this.maxEEAmount;
		return 100*frac+"%";
	}
	InvoiceBarHeightFrac (event,invoice) {
		var frac = 0;
		if (event.invoiceMaxAmount>0) frac = invoice.amount/event.invoiceMaxAmount;
		
		return 100*frac+"%";
	}
	InvoiceBarPositionFrac (invoice) {
		var dateFirst = this.viewOptions.dateFirst;
		var dateLast = this.viewOptions.dateLast;
		var dateInvoice = new Date(invoice.date);
		
		var frac = 0.95;
		if (dateInvoice.getTime()<dateLast.getTime()) frac = (dateInvoice.getTime()-dateFirst.getTime())/(dateLast.getTime()-dateFirst.getTime()) * 0.9 + 0.05;
		
		return 100*frac+"%";
	}

	getDateRangeFrac (event,side) {
		//random start and end
			if (side=='from') return 0.5*event.id/400;
			else return (0.5+0.5*event.name.length/50);
		
		/*
		var frac = (date.getTime() - this.viewOptions.dateOfFirst.getTime()) / ( this.viewOptions.dateOfLast.getTime() - this.viewOptions.dateOfFirst.getTime() );
		frac = Math.min(1,Math.max(0,frac));
		return frac;*/
	}
	 
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
		
		//this.openedEvent = null;
		this.eventReceiptsModal.show();
		
		this.dataService.getEvent(event._id)
			.then(eventData => this.openedEvent = eventData)
			.catch(err => {
				this.eventReceiptsModal.hide();
				this.toastService.toast("Nastala chyba při stahování údajů o akci. " + err.message,"error");
			});
	}

}