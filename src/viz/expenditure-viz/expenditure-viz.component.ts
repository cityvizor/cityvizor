import { Component, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';

import { DataService } from '../../services/data.service';
import { ToastService } 		from '../../services/toast.service';

import { paragraphNames } from '../../shared/data/paragraph-names.data';

import { ChartGroups }  from "../../shared/data/chartGroups";

/*

Component for graphical vizualization of expenditures

*/
@Component({
	moduleId: module.id,
	selector: 'expenditure-viz',
  host: {'(window:keydown)': 'hotkeys($event)'},
	templateUrl: 'expenditure-viz.template.html',
	styleUrls: ['expenditure-viz.style.css']
})
export class ExpenditureVizComponent{
	
	/* DATA */
	@Input()
	set profile(profile: any ){
		if(profile){
			this.profileId = profile._id;
			this.loadData(profile._id,this.year);
		}
	}
	
	profileId: string;
	
	@ViewChild('eventReceiptsModal')
	public eventReceiptsModal:ModalDirective;
	
	// decides which year's data should be loaded
	year: number = 2017;

	events = [];
	eventIndex = {};

	groups: any[] = [];
	groupIndex:any = {};

	paragraphNames: {};

	// which group (drawing stripe) is hovered at the moment
	hoveredGroup: string = null;

	// which group (drawign stripe) has been clicked and is open at the moment
	selectedGroup: string = null;

	openedEvent: any = null;

	openedGroupList: boolean = true;

	maxAmount:number = 0;

	vizScale: number = 1;	
	
	constructor(private _ds: DataService, private _toastService: ToastService){
		
		this.groups = ChartGroups; // set groups
		this.groups.forEach(group => {
			group.amount = 0;
			group.budgetAmount = 0;
			group.paragraphs = [];
			this.groupIndex[group.id] = group;
		});
		//this.selectedGroup = this.groups[0].id;
		this.paragraphNames = paragraphNames;
	}

	/**
		* method to handle left/right arrows to switch the selected group
		*/
	hotkeys(event){
		
		// we need to get array of groups so we can get next/prev group
		var groupIds = Object.keys(this.groupIndex);
		
		// index of current group. returns -1 in case no group selected, which is no problem for us
		var i = groupIds.indexOf(this.selectedGroup);

		//LEFT
		if(event.keyCode == 37) this.selectedGroup = groupIds[i - 1 >= 0 ? i - 1 : groupIds.length - 1];
		
		//RIGHT
		if(event.keyCode == 39) this.selectedGroup = groupIds[i + 1 <= groupIds.length - 1 ? i + 1 : 0];
  }

	 // numbers are parsed from CSV as text
	string2number(string){
		if(string.charAt(string.length - 1) === "-") string = "-" + string.substring(0,string.length - 1); //sometimes minus is at the end, put it to first character
		string.replace(",","."); // function Number accepts only dot as decimal point
		return Number(string);																									
	}

	getDonutChartData(paragraph){
		return {
			amount: paragraph.expenditureAmount,
			budgetAmount: paragraph.budgetExpenditureAmount
		};
	}

	/* PROCESS DATA */

	loadData(profileId,year){
		
		// get event names
		this._ds.getProfileEvents(profileId)
			.then(events => {
				this.events = events;
				this.eventIndex = {};
				this.events.forEach(event => this.eventIndex[event.event] = event);
			});
		
		// we get a Promise
		this._ds.getProfileBudget(profileId,year)
			.then((budget) => this.setData(budget))
			.catch((err) => {
				switch(err.status){
					case 404:
						this._toastService.toast("Data nejsou k dispozici", "warning");
						return;
						
					case 503:
						this._toastService.toast("Služba je momentálně nedostupná", "warning");
						return;
						
					default:
						this._toastService.toast("Nastala neočekávaná chyba " + err,"error");
				}
			});
	}

	getEventName(eventId){
		if(this.eventIndex[eventId]) return this.eventIndex[eventId].name;
		if(eventId) return "Investiční akce č. " + eventId;
		return "Ostatní";
	}

	findItem(array,id){
		var found;
		array.some(item => {
			if(item.id === id) {
				found = item;
				return true;
			}
			return false;
		});			
		return found;
	}

	setData(data){
		
		this.maxAmount = 0;
		
		this.groups.forEach(group => {
			group.amount = 0;
			group.budgetAmount = 0;
			group.paragraphs = [];
		});
		
		data.paragraphs.forEach(paragraph => {
			
			var groupId = paragraph.id.substring(0, 2);	
			
			if(this.groupIndex[groupId]){
				
				let group = this.groupIndex[groupId];
			
				group.budgetAmount += paragraph.budgetExpenditureAmount;
				group.amount += paragraph.expenditureAmount;
				group.paragraphs.push(paragraph);
			}
		});
		
		this.groups.forEach(group => {
			this.maxAmount = Math.max(this.maxAmount,group.budgetAmount,group.amount);
		});
		
	}

	openEvent(eventId){
		
		this.eventReceiptsModal.show();
		
		this._ds.getProfileEvent(this.profileId,eventId)
			.then(eventData => this.openedEvent = eventData)
			.catch(err => {
				this.eventReceiptsModal.hide();
				this._toastService.toast("Nastala chyba při stahování údajů o akci. " + err.message,"error");
			});
			
	}


	/* VIZ HELPER FUNCTIONS */
	getBarBudgetPercentage(group) {
		return 0;
	}
	getBarExpenditurePercentage(group) {
		return 0
	}
	

}