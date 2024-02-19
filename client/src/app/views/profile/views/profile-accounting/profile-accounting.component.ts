import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { BsModalService } from "ngx-bootstrap/modal";
import {
  Subscription,
  combineLatest,
  Subject,
  BehaviorSubject,
  ReplaySubject,
} from "rxjs";
import {
  map,
  filter,
  distinctUntilChanged,
  withLatestFrom,
} from "rxjs/operators";

import { DataService } from "app/services/data.service";
import { CodelistService } from "app/services/codelist.service";
import { ProfileService } from "app/services/profile.service";
import {
  AccountingService,
  AccountingGroupType,
} from "app/services/accounting.service";

import {
  BudgetEvent,
  Accounting,
  BudgetGroup,
  Budget,
  BudgetGroupEvent,
  Profile,
} from "app/schema";

import {
  ChartBigbangData,
  ChartBigbangDataRow,
} from "app/shared/charts/chart-bigbang/chart-bigbang.component";
import { EventDetailModalComponent } from "app/shared/components/event-detail-modal/event-detail-modal.component";

@Component({
  selector: "profile-accounting",
  templateUrl: "profile-accounting.component.html",
  styleUrls: ["profile-accounting.component.scss"],
  host: {
    "(window:keydown)": "hotkeys($event)",
  },
})
export class ProfileAccountingComponent implements OnInit {
  // type of view (expenditures/income)
  type = new BehaviorSubject<AccountingGroupType | null>(null);

  // state
  year = new ReplaySubject<number | null>(1);
  groupId = new ReplaySubject<string | null>(1);
  eventId = new ReplaySubject<number | null>(1);
  sort = new ReplaySubject<string>(1);
  showDetail = new BehaviorSubject<boolean>(false);

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

  typeLocalParams = { vydaje: "exp", prijmy: "inc" };

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
  ) {}

  async ngOnInit() {
    // route params
    this.route.params
      .pipe(
        map(params => this.typeLocalParams[params.type] || null),
        distinctUntilChanged()
      )
      .subscribe(this.type);
    this.route.params
      .pipe(
        map(params => Number(params.rok) || null),
        distinctUntilChanged()
      )
      .subscribe(this.year);
    this.route.params
      .pipe(
        map(params => params.skupina || null),
        distinctUntilChanged()
      )
      .subscribe(this.groupId);
    this.route.params
      .pipe(
        map(params => this.parseEventId(params.akce)),
        distinctUntilChanged()
      )
      .subscribe(this.eventId);
    this.route.params
      .pipe(
        map(params => params.razeni || "nejvetsi"),
        distinctUntilChanged()
      )
      .subscribe(this.sort);

    // load budgets based on profile
    this.profile.subscribe(profile => {
      // Remove Show detail button for PBO profiles (temporary fix)
      this.showDetail.next(profile.type !== "pbo");

      (profile.type == "municipality"
        ? this.dataService.getProfileBudgets(profile.id, {
            sumMode: profile.sumMode,
          })
        : this.dataService.getProfilePlans(profile.id)
      )
        .then(budgets => budgets.sort((a, b) => b.year - a.year))
        .then(budgets => this.budgets.next(budgets));
    });

    // load group events if passed via url (refreshed page or clicked on a link)
    this.profile.subscribe(async profile => {
      const params = this.route.snapshot.params;
      if (params.rok && params.type && params.skupina) {
        this.groupEvents = await this.accountingService.getGroupEvents(
          profile,
          params.rok,
          this.typeLocalParams[params.type],
          params.skupina
        );
      }
    });

    // set selected budget on year change
    combineLatest(this.year, this.budgets).subscribe(([year, budgets]) => {
      if (year) {
        this.budget = budgets.find(budget => budget.year === year) || null;
        if (!this.budget)
          this.selectBudget(budgets[0] ? budgets[0].year : null, true);
      } else this.selectBudget(budgets[0] ? budgets[0].year : null, true);
    });

    // download groups
    combineLatest(this.profile, this.type, this.year).subscribe(
      async ([profile, type, year]) => {
        if (!profile || !type || !year) return;
        await this.getGroups(profile, type, year);
      }
    );

    // download events
    combineLatest(this.groupId, this.year)
      .pipe(withLatestFrom(this.sort, this.type, this.profile))
      .subscribe(async ([[groupId, year], sort, type, profile]) => {
        if (!profile || !year || !type) return;

        this.resetEventsLimit();

        if (!groupId) {
          this.groupEvents = [];
          return;
        }
        this.groupEvents = await this.accountingService.getGroupEvents(
          profile,
          year,
          type,
          groupId
        );
        this.sortEvents(sort);
      });

    this.sort.subscribe(sort => this.sortEvents(sort));

    combineLatest(this.groups, this.groupId).subscribe(([groups, groupId]) => {
      if (groups.length > 0 && groupId) {
        this.group =
          groups.find(group => "id" in group && group.id === groupId) || null;
      }
    });

    this.groups.subscribe(groups => {
      this.chartBigbangData = groups.map(
        group =>
          ({
            id: group.id,
            innerAmount: group.amount,
            outerAmount: group.budgetAmount,
          }) as ChartBigbangDataRow
      );
    });

    combineLatest(this.eventId, this.profile, this.year)
      .pipe(filter(values => values.every(value => value != null))) // only if all not null
      .subscribe(([eventId, profile, year]) => {
        if (eventId != null && year != null && profile?.id != null) {
          this.modalService.show(EventDetailModalComponent, {
            initialState: { eventId, profile, year },
            class: "modal-xl",
          });
        }
      });

    this.modalService.onHide.subscribe(() => this.selectEvent(null));
  }

  selectBudget(year: string | number | null, replace: boolean = false): void {
    if (!year) return;
    this.modifyParams({ rok: year, akce: null }, true);
  }

  selectGroup(groupId: string | null): void {
    if (groupId === undefined) return;
    this.modifyParams({ skupina: groupId, akce: null }, true);
  }

  selectEvent(eventId: number | null): void {
    this.modifyParams({ akce: eventId }, false);
  }

  async getGroups(profile: Profile, type: AccountingGroupType, year: number) {
    const groups = await this.accountingService.getGroups(profile, type, year);
    groups.sort((a, b) =>
      a.name && b.name ? a.name.localeCompare(b.name) : 0
    );
    this.groups.next(groups);
    return groups;
  }

  selectSort(sort: string) {
    if (sort === undefined) return;
    this.modifyParams({ razeni: sort }, false);
  }

  modifyParams(modificationParams: any, replace: boolean): void {
    const routeParams = Object.assign({}, this.route.snapshot.params);
    delete routeParams.type;

    Object.entries(modificationParams).forEach(([key, value]) => {
      if (value !== null) routeParams[key] = value;
      else delete routeParams[key];
    });

    this.router.navigate(["./", routeParams], {
      relativeTo: this.route,
      replaceUrl: replace,
    });
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
    if (event.keyCode == 37)
      this.selectGroup(groups[i === 0 ? groups.length - 1 : i - 1].id);
    //RIGHT
    if (event.keyCode == 39)
      this.selectGroup(groups[i + 1 === groups.length ? 0 : i + 1].id);
  }

  getDonutChartData(event: BudgetGroupEvent) {
    return {
      id: event.id,
      amount: event.amount,
      budgetAmount: event.budgetAmount,
    };
  }

  getItemName(item: number, year: number) {
    return this.codelistService.getCurrentName(
      "items",
      String(item),
      new Date(year, 0, 1)
    );
  }

  sortEvents(sort: string) {
    switch (sort) {
      case "abecedne":
        this.groupEvents.sort((a, b) =>
          a.name && b.name ? a.name.localeCompare(b.name) : 0
        );
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

  private parseEventId(value: number | null | undefined): number | null {
    return value != null && !isNaN(value) ? Number(value) : null;
  }
}
