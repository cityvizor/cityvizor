import { Component, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
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
	selector: 'income-viz',
  host: {'(window:keydown)': 'hotkeys($event)'},
	templateUrl: 'income-viz.template.html',
	styleUrls: ['income-viz.style.css']
})
export class IncomeVizComponent{
	
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

	groups: any[] = [];
	groupIndex: any = {};

	eventIndex:any = {};
	itemNames = {};

	maxAmount:number = 0;

	// which group (drawing stripe) is hovered at the moment
	hoveredGroup: string = null;

	// which group (drawign stripe) has been clicked and is open at the moment
	selectedGroup: string = null;

	openedGroupList: boolean = true;

	vizScale: number = 1;	
	
	constructor(private _ds: DataService, private _toastService: ToastService, private changeDetectorRef:ChangeDetectorRef){
		this.groups = [
			{id: "1", title: "Daňové příjmy"},
			{id: "2", title: "Nedaňové příjmy"},
			{id: "3", title: "Kapitálové příjmy"},
			{id: "4", title: "Přijate transfery"}
		];	
		this.groups.forEach(group => this.groupIndex[group.id] = group);
	}

	getDonutChartData(item){
		return {
			amount: item.incomeAmount,
			budgetAmount: item.budgetIncomeAmount
		};
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

	getEventName(eventId){
		if(this.eventIndex[eventId]) return this.eventIndex[eventId].name;
		if(eventId) return "Investiční akce č. " + eventId;
		return "Ostatní";
	}

	/* PROCESS DATA */

	loadData(profileId,year){
		
		// get event names
		this._ds.getProfileEvents(profileId)
			.then(events => {
				this.eventIndex = {};
				events.forEach(event => this.eventIndex[event.event] = event);
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

  setData(budget){
		
		// set group values at once
    this.groups.forEach(group => {
			group.amount = 0;
			group.budgetAmount = 0;
			group.items = [];
    });
		
		budget.items.forEach(item => {

			let groupId = item.id.substring(0,1);
			
			if(this.groupIndex[groupId]){
				this.groupIndex[groupId].budgetAmount += item.budgetIncomeAmount;
				this.groupIndex[groupId].amount += item.incomeAmount;
				this.groupIndex[groupId].items.push(item);
			}
		});
		
		this.groups.forEach(group => {
			this.maxAmount = Math.max(this.maxAmount,group.budgetAmount,group.amount);
		});
		
  }

}