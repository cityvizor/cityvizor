import { Component, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription' ;

import { ModalDirective } from 'ngx-bootstrap';

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
	styleUrls: ['../../shared/styles/inc-exp-viz.style.css']
})
export class ExpenditureVizComponent{
	
	/* DATA */
	@Input()
	profile:any;
	
	@ViewChild('eventReceiptsModal')
	public eventReceiptsModal:ModalDirective;
	modalLoaded:boolean = false;
	
	state:{year:number,group:string,event:string} = {year:null,group:null,event:null};

	events = [];
	eventIndex = {};

	groups: any[] = [];
	groupIndex:any = {};

	paragraphNames: {};

	// which group (drawing stripe) is hovered at the moment
	hoveredGroup: string = null;
	openedGroupList: boolean = true;

	maxAmount:number = 0;
	maxBudgetsAmount:number = 0;

	vizScale: number = 1;	

	// store siubscription to unsubscribe on destroy
	paramsSubscription:Subscription;
	
	constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService, private _toastService: ToastService){
		
		this.groups = ChartGroups; // set groups
		this.groups.forEach(group => {
			group.amount = 0;
			group.budgetAmount = 0;
			group.paragraphs = [];
			this.groupIndex[group.id] = group;
		});
		
		this.paragraphNames = paragraphNames;
	}

	ngOnInit(){
		
		this.paramsSubscription = this.route.params.subscribe((params: Params) => {		
			
			let newState = {
				group: this.groupIndex[params["skupina"]] ? params["skupina"] : null,
				year: Number(params["rok"]),
				event: params["akce"]
			};
			
			let oldState = this.state;
			
			this.openedGroupList = !!newState.group;
			
			if(newState.year !== oldState.year && newState.year){
				this.loadBudget(this.profile._id,newState.year);
				this.loadEvents(this.profile._id,newState.year);
			}
			
			if(newState.event !== oldState.event && this.modalLoaded){
				if(newState.event) this.eventReceiptsModal.show();
				else this.eventReceiptsModal.hide();
			}
			
			this.state = newState;
			
		});
		
  }

	ngAfterViewInit(){
		this.modalLoaded = true;
		if(this.state.event) this.eventReceiptsModal.show();
		else this.eventReceiptsModal.hide();
	}

	ngOnDestroy(){
		this.paramsSubscription.unsubscribe();
	}

	selectBudget(budget){
		this.updateState({year: budget.year});
	}

	selectGroup(groupId){
		this.updateState({group: groupId});
	}

	selectEvent(event){
		this.updateState({event: event ? event.event : null});
	}

	updateState(setParams){
		
		let params = {
			rok: "year" in setParams ? setParams.year : this.state.year,
			skupina: "group" in setParams ? setParams.group : this.state.group,
			akce: "event" in setParams ? setParams.event : this.state.event
		};
		
		Object.keys(params).forEach(key => { if(!params[key]) delete params[key];});
		
		this.router.navigate(["./",params],{relativeTo:this.route});
	}

	/**
		* method to handle left/right arrows to switch the selected group
		*/
	hotkeys(event){
		
		// we need to get array of groups so we can get next/prev group
		var groupIds = Object.keys(this.groupIndex);
		
		// index of current group. returns -1 in case no group selected, which is no problem for us
		var i = groupIds.indexOf(this.state.group);

		//LEFT
		if(event.keyCode == 37) this.selectGroup(groupIds[i - 1 >= 0 ? i - 1 : groupIds.length - 1]);
		
		//RIGHT
		if(event.keyCode == 39) this.selectGroup(groupIds[i + 1 <= groupIds.length - 1 ? i + 1 : 0]);
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

	loadEvents(profileId,year){
		// get event names
		this.dataService.getProfileEvents(profileId,{year:year})
			.then(events => {
				this.events = events;
				this.eventIndex = {};
				this.events.forEach(event => this.eventIndex[event._id] = event);
			});
	}

	loadBudget(profileId,year){
		
		this.dataService.getProfileBudget(profileId,year)
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
		if(eventId) return "Nepojmenovaná investiční akce";
		return "Ostatní";
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

	

}