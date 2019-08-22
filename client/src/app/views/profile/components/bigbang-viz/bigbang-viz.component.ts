import { Component, Input, ViewChild, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

import { ModalDirective } from 'ngx-bootstrap';

import { DataService } from '../../../../services/data.service';
import { CodelistService } from '../../../../services/codelist.service';
import { ToastService } from '../../../../services/toast.service';

interface BigBangViewSettings {
	amount: string;
	budgetAmount: string;
	subGroup: {
		type: string,
		name: string,
		codelist: string
	},
	groupsCodelist: string
}

@Component({
	moduleId: module.id,
	selector: 'bigbang-viz',
	host: {
		'(window:keydown)': 'hotkeys($event)'
	},
	templateUrl: 'bigbang-viz.component.html',
	styleUrls: ['bigbang-viz.component.scss']
})
export class BigBangVizComponent implements OnInit, OnChanges {

	/* DATA */
	@Input()
	profile: any;

	@Input()
	type: string = "exp";

	settings: { [type: string]: BigBangViewSettings } = {
		"exp": {
			amount: "expenditureAmount",
			budgetAmount: "budgetExpenditureAmount",
			subGroup: {
				type: "paragraph",
				name: "Paragraf",
				codelist: "paragraphs"
			},
			groupsCodelist: "paragraph-groups"
		},

		"inc": {
			amount: "incomeAmount",
			budgetAmount: "budgetIncomeAmount",
			subGroup: {
				type: "item",
				name: "Položka",
				codelist: "items"
			},
			groupsCodelist: "item-groups"
		}
	};

	data: any = {};

	@ViewChild('eventReceiptsModal', { static: false })
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

	constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService, private codelistService: CodelistService, private toastService: ToastService) { }

	getConf(): BigBangViewSettings {
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
				this.groups.sort((a, b) => a.name.localeCompare(b.name));
			})
			.catch(err => {
				this.toastService.toast("Nastala chyba při načítání grafu.", "error");
				console.error(err);
			});
	}

	/* PROCESS DATA */
	async loadData() {

		this.data = {};

		try {
			let queue = [
				this.dataService.getProfileAccounting(this.profile.id, this.state.year).then(accounting => this.data.accounting = accounting),

				this.dataService.getProfileEvents(this.profile.id, { year: this.state.year }).then(events => {
					this.data.events = events;
					// create event index
					this.data.eventIndex = {};
					this.data.events.forEach(event => this.data.eventIndex[event.id] = event);
				})
			];

			await Promise.all(queue);

			this.setData();

		}
		catch (err) {
			if (err.status === 404) this.toastService.toast("Data nejsou k dispozici", "warning");
			else if (err.status === 503) this.toastService.toast("Služba je momentálně nedostupná", "warning");
			else {
				this.toastService.toast("Nastala neočekávaná chyba " + err, "error");
				console.error(err);
			}
		}

	}

	setData() {

		if (!this.groups.length) return;

		let accounting = this.data.accounting;
		let events = this.data.events;
		let eventIndex = this.data.eventIndex;

		let budget = this.data.budget = {};

		if (!budget || !events) return;

		this.groups.forEach(group => {
			group.amount = 0;
			group.budgetAmount = 0;
			group.subGroups = [];
		});

		let conf = this.getConf();

		const subGroupIndex = {};
		const subGroupEventsIndex = {};

		accounting.forEach(row => {

			if (!row[conf.subGroup.type]) return;

			let sgId = String(row[conf.subGroup.type]);

			let groupId = sgId.substring(0, 2);
			let group = this.groupIndex[groupId];

			let amount = row[conf.amount] || 0;
			let budgetAmount = row[conf.budgetAmount] || 0;

			// this shouldnt happen, but in case
			if (!group) { console.log("MISSING GROUP!", sgId, groupId); return; }

			// create the subgroup for view (do not modify source data)
			if (!subGroupIndex[sgId]) {
				subGroupIndex[sgId] = {
					id: sgId,
					name: "",
					events: [],
					amount: 0,
					budgetAmount: 0,
				};
				group.subGroups.push(subGroupIndex[sgId]);
			}

			let sg = subGroupIndex[sgId];

			sg.amount += amount;
			sg.budgetAmount += budgetAmount;

			if (!subGroupEventsIndex[sgId + "%" + row.event]) {
				console.log(eventIndex, eventIndex[row.event], row.event);
				subGroupEventsIndex[sgId + "%" + row.event] = {
					id: row.event,
					// assign name from event index
					name: eventIndex[row.event] ? eventIndex[row.event].name : "Nepojmenovaná investiční akce",
					// get correct amounts by inc or exp
					amount: 0,
					budgetAmount: 0,
				};
				sg.events.push(subGroupEventsIndex[sgId + "%" + row.event]);
			}

			let event = subGroupEventsIndex[sgId + "%" + row.event];

			event.amount += amount;
			event.budgetAmount += budgetAmount;


			/* add totals higher */
			group.amount += amount;
			group.budgetAmount += budgetAmount;

		});

		this.groups.forEach(group => {
			group.subGroups.forEach(sg => {
				sg.events.sort((a, b) => a.name.localeCompare(b.name));

				let eventsAmount = sg.events.reduce((acc, cur) => cur.amount + acc, 0);
				let eventsBudgetAmount = sg.events.reduce((acc, cur) => cur.budgetAmount + acc, 0);

				// add Other if necessary
				if (sg.amount !== eventsAmount || sg.budgetAmount !== eventsBudgetAmount) {
					let event = {
						name: "Ostatní",
						amount: sg.amount - eventsAmount,
						budgetAmount: sg.budgetAmount - eventsBudgetAmount
					};
					sg.events.push(event);
				}
			});
		});

		// assign names to subGroups
		this.codelistService.getCodelist(conf.subGroup.codelist)
			.then(codelist => {
				// get the index of names
				let index = codelist.getIndex(new Date(this.state.year, 0, 1));
				// assign all the names
				this.groups.forEach(group => {
					group.subGroups.forEach(sg => sg.name = index[sg.id] || (conf.subGroup.name + " č. " + sg.id));
				});
			})
			.catch(err => this.toastService.toast("Nepodařilo se načíst názvy položek a paragrafů.", "error"));

		this.maxAmount = 0;
		this.groups.forEach(group => {
			this.maxAmount = Math.max(this.maxAmount, group.budgetAmount, group.amount);
		});

	}


}