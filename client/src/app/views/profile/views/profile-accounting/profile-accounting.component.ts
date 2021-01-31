import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription, combineLatest, Subject, BehaviorSubject, ReplaySubject } from 'rxjs';
import { map, filter, distinctUntilChanged, withLatestFrom } from 'rxjs/operators';

import { DataService } from 'app/services/data.service';
import { CodelistService } from 'app/services/codelist.service';
import { ProfileService } from 'app/services/profile.service';
import { AccountingService, AccountingGroupType } from 'app/services/accounting.service';

import { BudgetEvent, Accounting, BudgetGroup, Budget, BudgetGroupEvent } from 'app/schema';

import { ChartBigbangData, ChartBigbangDataRow } from 'app/shared/charts/chart-bigbang/chart-bigbang.component';
import { EventDetailModalComponent } from "app/shared/components/event-detail-modal/event-detail-modal.component";

@Component({
	selector: 'profile-accounting',
	templateUrl: 'profile-accounting.component.html',
	styleUrls: ['profile-accounting.component.scss'],
	host: {
		'(window:keydown)': 'hotkeys($event)'
	}
})
export class ProfileAccountingComponent implements OnInit {

	// type of view (expenditures/income)
	type = new BehaviorSubject<AccountingGroupType | null>(null);

	// state
	year = new ReplaySubject<number | null>(1);
	groupId = new ReplaySubject<string | null>(1);
	eventId = new ReplaySubject<number | null>(1);
	sort = new ReplaySubject<string>(1);

	// view data
	profile = this.profileService.profile;
	budgets = new Subject<Budget[]>();

	accounting = new Subject<Accounting>();
	events = new Subject<BudgetEvent[]>();
	groups = new BehaviorSubject<BudgetGroup[]>([]);

	budget: Budget | null;
	group: BudgetGroup | null;
	groupEvents: BudgetGroupEvent[] = [];

	hoveredGroup: string | null;
	selectedEvent: number | null;

	eventsLimit: number = 20;

	chartBigbangData: ChartBigbangData;

	typeLocalParams = { "vydaje": "exp", "prijmy": "inc" };

	// store subscriptions to unsubscribe on destroy
	subscriptions: Subscription[] = [];

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private profileService: ProfileService,
		private accountingService: AccountingService,
		private codelistService: CodelistService,
		private dataService: DataService,
		private modalService: BsModalService,
		private cdRef: ChangeDetectorRef
	) { }

	ngOnInit() {

		// route params
		this.route.params.pipe(map(params => this.typeLocalParams[params.type] || null), distinctUntilChanged()).subscribe(this.type);

		this.route.params.pipe(map(params => Number(params.rok) || null), distinctUntilChanged()).subscribe(this.year);
		this.route.params.pipe(map(params => params.skupina || null), distinctUntilChanged()).subscribe(this.groupId);
		this.route.params.pipe(map(params => Number(params.akce) || null), distinctUntilChanged()).subscribe(this.eventId);
		this.route.params.pipe(map(params => params.razeni || "nejvetsi"), distinctUntilChanged()).subscribe(this.sort);

		// load budgets based on profile
		this.profile.subscribe(profile => this.dataService.getProfileBudgets(profile.id)
			.then(budgets => budgets.sort((a, b) => b.year - a.year))
			.then(budgets => this.budgets.next(budgets)));

		// set selected budget on year change
		combineLatest(this.year, this.budgets)
			.subscribe(([year, budgets]) => {
				if (year) {
					this.budget = budgets.find(budget => budget.year === year) || null;
					if (!this.budget) this.selectBudget(budgets[0] ? budgets[0].year : null, true);
				}
				else this.selectBudget(budgets[0] ? budgets[0].year : null, true);
			});

		// download groups
		combineLatest(this.profile, this.type, this.year)
			.subscribe(async ([profile, type, year]) => {
				if (!profile || !type || !year) return;
				const groups = await this.accountingService.getGroups(profile.id, type, year);
				groups.sort((a, b) => a.name && b.name ? a.name.localeCompare(b.name) : 0);
				this.groups.next(groups)
			});

		// download events
		combineLatest(this.profile, this.year, this.type, this.groupId)
			.pipe(withLatestFrom(this.sort))
			.subscribe(async ([[profile, year, type, groupId], sort]) => {
				if (!profile || !year || !type) return;

				this.resetEventsLimit();

				if (!groupId) { this.groupEvents = []; return; }

				this.groupEvents = await this.accountingService.getGroupEvents(profile.id, year, type, groupId);

				this.sortEvents(sort);
			})

		this.sort.subscribe(sort => this.sortEvents(sort));

		combineLatest(this.groupId, this.groups)
			.subscribe(([groupId, groups]) => this.group = groups.find(group => "id" in group && group.id === groupId) || null)

		this.groups.subscribe(groups => {
			this.chartBigbangData = groups.map(group => ({
				id: group.id,
				innerAmount: group.amount,
				outerAmount: group.budgetAmount
			} as ChartBigbangDataRow))
		});

		combineLatest(this.eventId, this.profile.pipe(map(profile => profile.id)), this.year)
			.pipe(filter(values => values.every(value => !!value))) // only if all not null
			.subscribe(([eventId, profileId, year]) => {
				if (eventId !== null && year !== null && typeof profileId !== 'undefined') {
					this.modalService.show(EventDetailModalComponent, { initialState: { eventId, profileId, year }, class: "modal-lg" });
				}
			})

		this.modalService.onHide.subscribe(() => this.selectEvent(null));

	}

	selectBudget(year: string | number | null, replace: boolean = false): void {
		if (!year) return;
		this.modifyParams({ rok: year, skupina: null, akce: null }, true)
	}

	selectGroup(groupId: string | null): void {
		console.log("selectGroup", groupId);
		if (groupId === undefined) return;
		this.modifyParams({ skupina: groupId, akce: null }, true)
	}

	selectEvent(eventId: number | null): void {
		if (eventId && eventId > 0) {
			this.modifyParams({ akce: eventId }, false)
		}
	}


	selectSort(sort: string) {
		console.log("selectSort", sort);
		if (sort === undefined) return;
		this.modifyParams({ "razeni": sort }, false);
	}

	modifyParams(modificationParams: any, replace: boolean): void {
		const routeParams = Object.assign({}, this.route.snapshot.params)
		delete routeParams.type;

		Object.entries(modificationParams).forEach(([key, value]) => {
			if (value !== null) routeParams[key] = value;
			else delete routeParams[key];
		});

		this.router.navigate(["./", routeParams], { relativeTo: this.route, replaceUrl: replace })
	}

	setHoveredGroup(groupId: string) {
		this.hoveredGroup = groupId;
	}

	/**
	 * method to handle left/right arrows to switch the selected group
	 */
	hotkeys(event: KeyboardEvent) {

		const current = this.group;
		if (!current) return;

		const groups = this.groups.value;
		const i = groups.findIndex(group => group.id === current.id);

		//LEFT
		if (event.keyCode == 37) this.selectGroup(groups[i === 0 ? groups.length - 1 : i - 1].id);
		//RIGHT
		if (event.keyCode == 39) this.selectGroup(groups[i + 1 === groups.length ? 0 : i + 1].id);
	}


	getDonutChartData(event: BudgetGroupEvent) {
		return {
			id: event.id,
			amount: event.amount,
			budgetAmount: event.budgetAmount
		}
	}

	getItemName(item: number, year: number) {
		return this.codelistService.getCurrentName("items", String(item), new Date(year, 0, 1));
	}

	sortEvents(sort: string) {
		switch (sort) {

			case "abecedne":
				this.groupEvents.sort((a, b) => a.name && b.name ? a.name.localeCompare(b.name) : 0);
				break;

			case "nejvetsi":
				this.groupEvents.sort((a, b) => b.budgetAmount - a.budgetAmount);
				break;
		}

		this.cdRef.detectChanges(); // sorting would not be detected by change detector
	}

	isMoreEvents(): boolean {
		return this.groupEvents.length > this.eventsLimit;
	}

	showMoreEvents(): void {
		this.eventsLimit += 20;
	}

	showAllEvents(): void {
		this.eventsLimit = Infinity;
	}

	resetEventsLimit(): void {
		this.eventsLimit = 20;
	}

}