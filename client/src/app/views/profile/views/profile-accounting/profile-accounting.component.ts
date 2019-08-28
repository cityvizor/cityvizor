import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, RouterLink, UrlTree } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap';
import { Subscription, Observable, combineLatest, Subject, BehaviorSubject, ReplaySubject } from 'rxjs';
import { map, filter, withLatestFrom, distinctUntilChanged } from 'rxjs/operators';

import { DataService } from 'app/services/data.service';
import { CodelistService } from 'app/services/codelist.service';
import { ProfileService } from '../../services/profile.service';
import { AccountingService } from 'app/services/accounting.service';

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
	type = new BehaviorSubject<string>(null);

	// state
	year = new ReplaySubject<number>(1);
	groupId = new ReplaySubject<string>(1);
	eventId = new ReplaySubject<number>(1);

	// view data
	profile = this.profileService.profile;
	budgets = new Subject<Budget[]>();

	accounting = new Subject<Accounting>();
	events = new Subject<BudgetEvent[]>();
	groups = new BehaviorSubject<BudgetGroup[]>([]);

	budget: Budget;
	group: BudgetGroup;
	groupEvents: BudgetGroupEvent[];

	hoveredGroup: string;
	selectedEvent: number;

	eventsLimit: number = 20;

	chartBigbangData: ChartBigbangData;

	// store subscriptions to unsubscribe on destroy
	subscriptions: Subscription[] = [];

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private profileService: ProfileService,
		private accountingService: AccountingService,
		private codelistService: CodelistService,
		private dataService: DataService,
		private modalService: BsModalService
	) { }

	ngOnInit() {

		// route params
		this.route.params.pipe(map(params => Number(params.rok) || null), distinctUntilChanged()).subscribe(this.year);
		this.route.params.pipe(map(params => params.skupina || null), distinctUntilChanged()).subscribe(this.groupId);
		this.route.params.pipe(map(params => Number(params.akce) || null), distinctUntilChanged()).subscribe(this.eventId);
		this.route.params.pipe(map(params => params.type === "vydaje" ? "exp" : "inc"), distinctUntilChanged()).subscribe(this.type);

		// load budgets based on profile
		this.profile.subscribe(profile => this.dataService.getProfileBudgets(profile.id).then(budgets => this.budgets.next(budgets)));

		// set selected budget on year change
		combineLatest(this.year, this.budgets)
			.subscribe(([year, budgets]) => {
				if (year) {
					this.budget = budgets.find(budget => budget.year === year);
					if (!this.budget) this.selectBudget(budgets[0] ? budgets[0].year : null, true);
				}
				else this.selectBudget(budgets[0] ? budgets[0].year : null, true);
			});

		// download groups
		combineLatest(this.profile, this.type, this.year)
			.pipe(filter(values => values.every(value => !!value))) // only if all not null
			.subscribe(async ([profile, type, year]) => {
				const groups = await this.accountingService.getGroups(profile.id, type, year);
				groups.sort((a, b) => a.name.localeCompare(b.name));
				this.groups.next(groups)
			});

		// download events
		combineLatest(this.profile, this.year, this.type, this.groupId)
			.subscribe(async ([profile, year, type, groupId]) => {
				if (!profile || !year || !type) return;

				this.resetEventsLimit();

				if (!groupId) this.groupEvents = []

				const groupEvents = await this.accountingService.getGroupEvents(profile.id, year, type, groupId);
				groupEvents.sort((a, b) => b.budgetAmount - a.budgetAmount);
				this.groupEvents = groupEvents;
			})

		combineLatest(this.groupId, this.groups)
			.subscribe(([groupId, groups]) => this.group = groups.find(group => group.id === groupId))

		this.groups.subscribe(groups => {
			this.chartBigbangData = groups.map(group => ({
				id: group.id,
				innerAmount: group.amount,
				outerAmount: group.budgetAmount
			} as ChartBigbangDataRow))
		});

		combineLatest(this.eventId, this.profile, this.year)
			.pipe(filter(values => values.every(value => !!value))) // only if all not null
			.subscribe(([eventId, profile, year]) => {
				this.modalService.show(EventDetailModalComponent, { initialState: { eventId, profileId: profile.id, year }, class: "modal-lg" });
			})

		this.modalService.onHide.subscribe(() => this.selectEvent(null));

	}

	selectBudget(year: string | number, replace: boolean = false): void {
		console.log("selectBudget", year);
		if (!year) return;
		const params = Object.assign({}, this.route.snapshot.params, { rok: String(year) });
		delete params.type;
		this.router.navigate(["./", params], { relativeTo: this.route, replaceUrl: replace })
	}

	selectGroup(groupId: string): void {
		console.log("selectGroup", groupId);
		if (groupId === undefined) return;
		const params = Object.assign({}, this.route.snapshot.params, { skupina: groupId || undefined });
		delete params.type;
		this.router.navigate(["./", params], { relativeTo: this.route })
	}

	selectEvent(eventId: string): void {
		console.log("selectEvent", eventId);
		if (eventId === undefined) return;

		const params = Object.assign({}, this.route.snapshot.params)

		if (eventId) params.akce = eventId;
		else delete params.akce;

		delete params.type;

		this.router.navigate(["./", params], { relativeTo: this.route })
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