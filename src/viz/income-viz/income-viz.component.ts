import { Component, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription' ;

import { ModalDirective } from 'ngx-bootstrap';

import { DataService } from '../../services/data.service';
import { ToastService } 		from '../../services/toast.service';

import { itemNames } from '../../shared/data/item-names.data';

import { ChartGroups }  from "../../shared/data/chartGroups";

/*

Component for graphical vizualization of expenditures

*/
@Component({
	moduleId: module.id,
	selector: 'income-viz',
  host: {'(window:keydown)': 'hotkeys($event)'},
	templateUrl: 'income-viz.template.html',
	styleUrls: ['../../shared/styles/inc-exp-viz.style.css']
})
export class IncomeVizComponent{
	
	/* DATA */
	@Input()
	profile:any;
	
	profileId: string;
	
	@ViewChild('eventReceiptsModal')
	public eventReceiptsModal:ModalDirective;
	
	groups: any[] = [];
	groupIndex: any = {};

	eventIndex:any = {};
	itemNames = itemNames;

	maxAmount:number = 0;

	// which group (drawing stripe) is hovered at the moment
	hoveredGroup: string = null;

	// which group (drawign stripe) has been clicked and is open at the moment
	selectedGroup: string = null;

	openedEvent:any;

	openedGroupList: boolean = true;

	vizScale: number = 1;	
	
	// store siubscription to unsubscribe on destroy
	paramsSubscription:Subscription;
	
	constructor(private router: Router, private route: ActivatedRoute, private _ds: DataService, private _toastService: ToastService){
		this.groups = [
			{id: "1", title: "Daňové příjmy"},
			{id: "2", title: "Nedaňové příjmy"},
			{id: "3", title: "Kapitálové příjmy"},
			{id: "4", title: "Přijate transfery"}
		];	
		
		this.groups = [
			{id:  "11", title: "Daně z příjmů, zisku a kapitálových výnosů"},
			{id:  "12", title: "Daně ze zboží a služeb v tuzemsku"},
			{id:  "13", title: "Daně a poplatky z vybraných činností a služeb"},
			{id:  "14", title: "Daně a cla za zboží a služby ze zahraničí "},
			{id:  "15", title: "Majetkové daně"},
			{id:  "16", title: "Povinné pojistné na sociální zabezpečení, příspěvek na státní politiku zaměstnanosti a veřejné zdravotní pojištění"},
			{id:  "17", title: "Ostatní daňové příjmy"},
			{id:  "21", title: "Příjmy z vlastní činnosti a odvody přebytků organizací s přímým vztahem"},
			{id:  "22", title: "Přijaté sankční platby a vratky transferů"},
			{id:  "23", title: "Příjmy z prodeje nekapitálového majetku a ostatní nedaňové příjmy"},
			{id:  "24", title: "Přijaté splátky půjčených prostředků "},
			{id:  "25", title: "Příjmy sdílené s nadnárodním orgánem"},
			{id:  "31", title: "Příjmy z prodeje dlouhodobého majetku a ostatní kapitálové příjmy"},
			{id:  "32", title: "Příjmy z prodeje akcií a majetkových podílů "},
			{id:  "41", title: "Neinvestiční přijaté transfery"},
			{id:  "42", title: "Investiční přijaté transfery"}
		];
		this.groups.forEach(group => this.groupIndex[group.id] = group);
	}



	ngOnInit(){
		
		this.paramsSubscription = this.route.params.subscribe((params: Params) => {		
			
			if(params["polozka"]) {
				if(this.groupIndex[params["polozka"]]){
					this.selectedGroup = params["polozka"];
					this.openedGroupList = false;
				}
				else this.selectGroup(null);
			}
			else {
				this.selectedGroup = null;
				this.openedGroupList = true;
			}
			
		});
		
  }

	ngOnDestroy(){
		this.paramsSubscription.unsubscribe();
	}

	selectGroup(group){
		this.router.navigate(group ? ["./",{"polozka":group}] : ["./",{}],{relativeTo:this.route});
	}

	selectBudget(budget){
		this.loadBudget(this.profileId,budget.year);
		this.loadEvents(this.profileId,budget.year);
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

	getEventName(eventId){
		if(this.eventIndex[eventId]) return this.eventIndex[eventId].name;
		if(eventId) return "Investiční akce č. " + eventId;
		return "Ostatní";
	}


	getDonutChartData(item){
		return {
			amount: item.incomeAmount,
			budgetAmount: item.budgetIncomeAmount
		};
	}

	/* PROCESS DATA */

	loadEvents(profileId,year){
		
		// get event names
		this._ds.getProfileEvents(profileId,{year:year})
			.then(events => {
				this.eventIndex = {};
				events.forEach(event => this.eventIndex[event.event] = event);
			});
		
		
	}

	loadBudget(profileId,year){
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

			let groupId = item.id.substring(0,2);
			
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

	openEvent(eventId){
		
		this.eventReceiptsModal.show();
		
		this.openedEvent = eventId;
			
	}

}