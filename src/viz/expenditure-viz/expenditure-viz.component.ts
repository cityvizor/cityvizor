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

	// the data loaded
	budget = {
		year: this.year,
		
		events: [],
		groups: [],
		paragraphs: [],
		
		expenditureAmount: 0,
		maxExpenditureAmount: 0,
		budgetAmount: 0,
		maxBudgetAmount: 0,
		
		groupIndex: {},
		paragraphIndex: {},
		eventIndex: {}
	};

	events = [];
	eventIndex = {};

	groups: Array<{"id": string, "title": string}>;
	paragraphNames: {};

	// which group (drawing stripe) is hovered at the moment
	hoveredGroup: any = null;

	// which group (drawign stripe) has been clicked and is open at the moment
	selectedGroup: any = null;

	openedEvent: any = null;

	infoWindowClosed:boolean;

	vizScale: number = 1;	
	
	constructor(private _ds: DataService, private _toastService: ToastService){
		this.groups = ChartGroups; // set groups
		this.paragraphNames = paragraphNames;
	}
	 
	 // numbers are parsed from CSV as text
	string2number(string){
		if(string.charAt(string.length - 1) === "-") string = "-" + string.substring(0,string.length - 1); //sometimes minus is at the end, put it to first character
		string.replace(",","."); // function Number accepts only dot as decimal point
		return Number(string);																									
	}

	/* PROCESS DATA */

	loadData(id,year){
		
		if(!id || !year) return;
		
		// data on expenditures (from the organization accounting software) are loaded and parsed.
		var i = 0;
		
		// get event names
		this._ds.getEvents(id)
			.then(events => {
				this.events = events;
				this.eventIndex = {};
				this.events.forEach(event => this.eventIndex[event.id] = event);
			});
		
		// we get a Promise
		this._ds.getBudget(id,year)
			.then((data) => {
				this.linkData(data);
				this.sortData(data);
				console.log(data);
				this.budget = data;
			})
			.catch((err) => {
				switch(err.status){
					case 404:
						this._toastService.toast("Data nejsou k dispozici", "warning");
						return;
						
					case 503:
						this._toastService.toast("Služba je momentálně nedostupná", "warning");
						return;
						
					default:
						this._toastService.toast("Nastala neočekávaná chyba","error");
				}
			});
	}

	getEventName(eventId){
		return this.eventIndex[eventId] ? this.eventIndex[eventId].name : "Akce " + eventId;
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

	getGroupByParagraph(data,paragraph){
		var groupId = paragraph.id.substring(0, 2);	
		if(!data.groupIndex[groupId]){
			var group = {
				id: groupId,
				budgetAmount:0,
				expenditureAmount:0,
				paragraphs: []
			}
			data.groupIndex[groupId] = group;
			data.groups.push(group);
		}		
		return data.groupIndex[groupId];
	}

	linkData(data){
		
		data.groups = [];
		
		data.paragraphIndex = {};
		data.groupIndex = {};
		
		data.maxBudgetAmount = 0;
		data.maxExpenditureAmount = 0;
		
		data.paragraphs.forEach(paragraph => {
			var group = this.getGroupByParagraph(data,paragraph);		
			group.budgetAmount += paragraph.budgetAmount;
			group.expenditureAmount += paragraph.expenditureAmount;
			group.paragraphs.push(paragraph);
			
			data.paragraphIndex[paragraph.id] = paragraph;
		});
		
		data.groups.forEach(group => {
			data.maxBudgetAmount = Math.max(data.maxBudgetAmount,group.budgetAmount);
			data.maxExpenditureAmount = Math.max(data.maxExpenditureAmount,group.expenditureAmount);
		});
		
	}
	
	sortData(data){

		var field1 = "expenditureAmount";
		var field2 = "budgetAmount";
		
		data.groups.sort((a,b) => b[field1] !== a[field1] ? b[field1] - a[field1] : b[field2] - a[field2]);
		data.paragraphs.forEach(paragraph => {
			paragraph.events.sort((a,b) => b[field1] !== a[field1] ? b[field1] - a[field1] : b[field2] - a[field2]);
		});
	}

	// select group (e.g. after clicking a stripe)
	selectGroup(group,scroll){
		this.selectedGroup = group;
		this.vizScale = this.selectedGroup !== null ?  0.5 : 1;
	}

	openEvent(eventId){
		
		this.eventReceiptsModal.show();
		console.log(eventId);
		this._ds.getProfileEvent(this.profileId,eventId)
			.then(eventData => this.openedEvent = eventData)
			.catch(err => {
				this.eventReceiptsModal.hide();
				this._toastService.toast("Nastala chyba při stahování údajů o akci. " + err.message,"error");
			});
			
	}


	/* VIZ HELPER FUNCTIONS */
	getBarBudgetPercentage(group) {
		if(!this.budget.groupIndex[group.id]) return 0;
		return Math.round(this.budget.groupIndex[group.id].budgetAmount / this.budget.maxBudgetAmount * 100);
	}
	getBarExpenditurePercentage(group) {
		if(!this.budget.groupIndex[group.id]) return 0;
		return Math.round(this.budget.groupIndex[group.id].expenditureAmount / this.budget.groupIndex[group.id].budgetAmount * 100);
	}
	

}