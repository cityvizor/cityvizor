import { Component, Input, ViewChild, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

import { ModalDirective } from 'ngx-bootstrap';

import { DataService } from '../../../services/data.service';
import { CodelistService } from '../../../services/codelist.service';
import { ToastService } from '../../../services/toast.service';

@Component({
	moduleId: module.id,
	selector: 'bigbang-viz',
	host: {
		'(window:keydown)': 'hotkeys($event)'
	},
	templateUrl: 'bigbang-viz.template.html',
	styleUrls: ['bigbang-viz.style.css']
})
export class BigBangVizComponent implements OnInit, OnChanges {

	/* DATA */
	@Input()
	profile: any;

	@Input()
	type: string = "exp";

	settings = {
		"exp": {
			amount: "expenditureAmount",
			budgetAmount: "budgetExpenditureAmount",
			subGroup: {
				type: "paragraphs",
				name: "Paragraf",
				codelist: "paragraph-names"
			},
			groupsCodelist: "paragraph-groups"
		},

		"inc": {
			amount: "incomeAmount",
			budgetAmount: "budgetIncomeAmount",
			subGroup: {
				type: "items",
				name: "Položka",
				codelist: "item-names"
			},
			groupsCodelist: "item-groups"
		}
	};

	data: any = {};

	@ViewChild('eventReceiptsModal')
	public eventReceiptsModal: ModalDirective;
	modalLoaded: boolean = false;

	state: {
		year: number,
		group: string,
		event: string
	} = {
		year: null,
		group: null,
		event: null
	};

	codelistDate: Date;

	events = [];
	eventIndex = {};

	groups: any[] = [];
	groupIndex: any = {};

	// which group (drawing stripe) is hovered at the moment
	hoveredGroup: string = null;
	openedGroupList: boolean = true;

	maxAmount: number = 0;
	maxBudgetsAmount: number = 0;

	vizScale: number = 1;


	// store siubscription to unsubscribe on destroy
	paramsSubscription: Subscription;

	constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService, private codelistService: CodelistService, private toastService: ToastService) {}

	getConf(){
		return this.settings[this.type];
	}
	
	ngOnChanges(changes: SimpleChanges) {
		if (changes.type) this.loadGroups().then(() => this.setData());
	}

	ngOnInit() {
		this.loadGroups();
		this.watchState();
	}

	watchState() {
		this.paramsSubscription = this.route.params.subscribe((params: Params) => {

			let newState = {
				group: params["skupina"],
				year: Number(params["rok"]),
				event: params["akce"]
			};

			let oldState = this.state;

			this.state = newState;

			this.openedGroupList = !!newState.group;

			if (newState.year !== oldState.year && newState.year) {
				this.loadData();
			}

			if (newState.event !== oldState.event && this.modalLoaded) {
				if (newState.event) this.eventReceiptsModal.show();
				else this.eventReceiptsModal.hide();
			}


		});
	}

	ngAfterViewInit() {
		this.modalLoaded = true;
		if (this.state.event) this.eventReceiptsModal.show();
		else this.eventReceiptsModal.hide();
	}

	ngOnDestroy() {
		this.paramsSubscription.unsubscribe();
	}

	selectBudget(budget) {
		this.updateState({
			year: budget.year
		});
	}

	selectGroup(groupId) {
		this.updateState({
			group: groupId
		});
	}

	selectEvent(eventId) {
		this.updateState({
			event: eventId
		});
	}

	updateState(setParams) {

		var replaceUrl = !this.state.year; // if no year was set replace history so we can go back

		let params = {
			rok: "year" in setParams ? setParams.year : this.state.year,
			skupina: "group" in setParams ? setParams.group : this.state.group,
			akce: "event" in setParams ? setParams.event : this.state.event
		};

		Object.keys(params).forEach(key => {
			if (!params[key]) delete params[key];
		});

		this.router.navigate(["./", params], {
			relativeTo: this.route,
			replaceUrl: replaceUrl
		});
	}

	/**
	 * method to handle left/right arrows to switch the selected group
	 */
	hotkeys(event) {

		// we need to get array of groups so we can get next/prev group
		var groupIds = Object.keys(this.groupIndex);

		// index of current group. returns -1 in case no group selected, which is no problem for us
		var i = groupIds.indexOf(this.state.group);

		//LEFT
		if (event.keyCode == 37) this.selectGroup(groupIds[i - 1 >= 0 ? i - 1 : groupIds.length - 1]);

		//RIGHT
		if (event.keyCode == 39) this.selectGroup(groupIds[i + 1 <= groupIds.length - 1 ? i + 1 : 0]);
	}

	// numbers are parsed from CSV as text
	string2number(string) {
		if (string.charAt(string.length - 1) === "-") string = "-" + string.substring(0, string.length - 1); //sometimes minus is at the end, put it to first character
		string.replace(",", "."); // function Number accepts only dot as decimal point
		return Number(string);
	}

	getDonutChartData(sg) {
		return {
			amount: sg.amount,
			budgetAmount: sg.budgetAmount
		};
	}

	loadGroups() {

		let conf = this.getConf();
		
		return this.codelistService.getCodelist(conf.groupsCodelist)
			.then(codelist => {
				this.groups = codelist.getNames(new Date());

				this.groupIndex = {};

				this.groups.forEach(group => {
					group.subGroups = [];
					this.groupIndex[group.id] = group;
				});
			})
			.catch(err => this.toastService.toast("Nastala chyba při načítání grafu.", "error"));
	}
	
	/* PROCESS DATA */
	loadData() {
		
		this.data = {};

		let queue = [
			this.dataService.getProfileBudget(this.profile._id, this.state.year).then(budget => this.data.budget = budget),
			this.dataService.getProfileEvents(this.profile._id, { year: this.state.year }).then(events => {
				this.data.events = events;
				// create event index
				this.data.eventIndex = {};
				this.data.events.forEach(event => this.data.eventIndex[event._id] = event);
			})
		];


		Promise.all(queue)
			.then(() => this.setData())
			.catch((err) => {
				if (err.status === 404) this.toastService.toast("Data nejsou k dispozici", "warning");
				else if (err.status === 503) this.toastService.toast("Služba je momentálně nedostupná", "warning");
				else this.toastService.toast("Nastala neočekávaná chyba " + err, "error");
			});

	}

	setData() {
		
		if(!this.groups.length) return;

		let budget = this.data.budget;
		let events = this.data.events;
		let eventIndex = this.data.eventIndex;

		if (!budget || !events) return;

		this.groups.forEach(group => {
			group.amount = 0;
			group.budgetAmount = 0;
			group.subGroups = [];
		});

		let conf = this.getConf();

		budget[conf.subGroup.type].forEach(budgetSG => {

			let groupId = budgetSG.id.substring(0, 2);
			let group = this.groupIndex[groupId];

			// this shouldnt happen, but in case
			if (!group) { console.log("MISSING GROUP!"); return; }
			
			// create the subgroup for view (do not modify source data)
			let sg = {
				id: budgetSG.id,
				name: "",
				events:[],
				amount: budgetSG[conf.amount],
				budgetAmount: budgetSG[conf.budgetAmount]
			};
			
			let eventsAmount = 0;
			let eventsBudgetAmount = 0;

			budgetSG.events.forEach(budgetSGevent => {
				let event = {
					_id: budgetSGevent.event,
					// assign name from event index
					name: eventIndex[budgetSGevent.event] ? eventIndex[budgetSGevent.event].name : "Nepojmenovaná investiční akce",
					// get correct amounts by inc or exp
					amount: budgetSGevent[conf.amount],
					budgetAmount: budgetSGevent[conf.budgetAmount]
				};
				
				sg.events.push(event);
				
				// sum events to get the Other value
				eventsAmount += event.amount;
				eventsBudgetAmount += event.budgetAmount;
			});

			// sort events in sg
			sg.events.sort((a, b) => a.name.localeCompare(b.name));

			// add Other if necessary
			if (sg.amount !== eventsAmount || sg.budgetAmount !== eventsBudgetAmount) {
				let event = {
					name: "Ostatní",
					amount: sg.amount - eventsAmount,
					budgetAmount: sg.budgetAmount - eventsBudgetAmount
				};
				sg.events.push(event);
			}
			
			
			/* integrate the subgroup to the parent group */

			group.amount += sg.amount;
			group.budgetAmount += sg.budgetAmount;

			// add the subGroup to the subGroup list
			group.subGroups.push(sg);

		});

		// assign names to subGroups
		this.codelistService.getCodelist(conf.subGroup.codelist)
			.then(codelist => {
				// get the index of names
				let index = codelist.getIndex(new Date(budget.year, 0, 1));
				// assign all the names
				this.groups.forEach(group => {
					group.subGroups.forEach(sg => sg.name = index[sg.id] || (conf.subGroup.name + " č. " + sg.id));
				});
			})
			.catch(err => this.toastService.toast("Nepodařilo se načíst názvy položek a paragrafů.","error"));

		this.maxAmount = 0;
		this.groups.forEach(group => {
			this.maxAmount = Math.max(this.maxAmount, group.budgetAmount, group.amount);
		});

	}


}