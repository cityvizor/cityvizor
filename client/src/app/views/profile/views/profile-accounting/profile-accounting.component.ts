import {
  Component,
  OnInit,
  ChangeDetectorRef,
  DestroyRef,
  inject,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";

import { BsModalService } from "ngx-bootstrap/modal";
import { combineLatest, Subject, BehaviorSubject, ReplaySubject } from "rxjs";
import {
  map,
  filter,
  distinctUntilChanged,
  take,
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
import { BudgetSelectComponent } from "../../components/budget-select/budget-select.component";
import { FormsModule } from "@angular/forms";
import { ChartBigbangComponent } from "../../../../shared/charts/chart-bigbang/chart-bigbang.component";
import { GroupSelectComponent } from "../../components/group-select/group-select.component";
import { AccountingGroupCardsComponent } from "../../components/accounting-group-cards/accounting-group-cards.component";
import { AsyncPipe, SlicePipe, ViewportScroller } from "@angular/common";
import { ChartDonutComponent } from "../../../../shared/charts/chart-donut/chart-donut.component";
import { MoneyPipe } from "../../../../shared/pipes/money.pipe";
import { TranslatePipe } from "@ngx-translate/core";

const itemSortOptions = [
  "number-ascending",
  "number-descending",
  "budget-ascending",
  "budget-descending",
  "actual-ascending",
  "actual-descending",
] as const;

type ItemSort = (typeof itemSortOptions)[number];

const defaultItemSort: ItemSort = "budget-descending";

function isItemSort(value: unknown): value is ItemSort {
  return itemSortOptions.includes(value as ItemSort);
}

type AccountingOverview = "cards" | "map" | "bars";

@Component({
  selector: "profile-accounting",
  templateUrl: "profile-accounting.component.html",
  styleUrls: ["profile-accounting.component.scss"],
  host: {
    "(window:keydown)": "hotkeys($event)",
  },
  imports: [
    BudgetSelectComponent,
    FormsModule,
    ChartBigbangComponent,
    GroupSelectComponent,
    AccountingGroupCardsComponent,
    ChartDonutComponent,
    AsyncPipe,
    SlicePipe,
    MoneyPipe,
    TranslatePipe,
  ],
})
export class ProfileAccountingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private profileService = inject(ProfileService);
  private accountingService = inject(AccountingService);
  private codelistService = inject(CodelistService);
  private dataService = inject(DataService);
  private modalService = inject(BsModalService);
  private cdRef = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private viewportScroller = inject(ViewportScroller);

  // type of view (expenditures/income)
  type = new BehaviorSubject<AccountingGroupType | null>(null);

  // state
  year = new ReplaySubject<number | null>(1);
  groupId = new ReplaySubject<string | null>(1);
  eventId = new ReplaySubject<number | null>(1);
  sort = new ReplaySubject<string>(1);
  itemSort = new ReplaySubject<ItemSort>(1);

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
  accountingOverview: AccountingOverview = "cards";

  eventsLimit: number = 20;

  chartBigbangData: ChartBigbangData;

  typeLocalParams = { vydaje: "exp", prijmy: "inc" };

  async ngOnInit() {
    // route params
    this.route.params
      .pipe(
        map(params => this.typeLocalParams[params.type] || null),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(this.type);
    this.route.params
      .pipe(
        map(params => Number(params.rok) || null),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(this.year);
    this.route.params
      .pipe(
        map(params => params.skupina || null),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(this.groupId);
    this.route.params
      .pipe(
        map(params => this.parseEventId(params.akce)),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(this.eventId);
    this.route.params
      .pipe(
        map(params => params.razeni || "nejvetsi"),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(this.sort);
    this.route.params
      .pipe(
        map(params =>
          isItemSort(params.itemSort)
            ? params.itemSort
            : defaultItemSort,
        ),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(this.itemSort);

    // load budgets based on profile
    this.profile
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(profile => {
        (profile.type == "municipality"
          ? this.dataService.getProfileBudgets(profile.id, {
              sumMode: profile.sumMode,
            })
          : this.dataService.getProfilePlans(profile.id)
        )
          .then(budgets => budgets.sort((a, b) => b.year - a.year))
          .then(budgets => this.budgets.next(budgets));
      });

    // set selected budget on year change
    combineLatest(this.year, this.budgets)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([year, budgets]) => {
        if (year) {
          this.budget = budgets.find(budget => budget.year === year) || null;
          if (!this.budget)
            this.selectBudget(budgets[0] ? budgets[0].year : null, true);
        } else this.selectBudget(budgets[0] ? budgets[0].year : null, true);
      });

    // download groups
    combineLatest(this.profile, this.type, this.year)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async ([profile, type, year]) => {
        if (!profile || !type || !year) return;
        await this.getGroups(profile, type, year);
      });

    // download events
    combineLatest(this.groupId, this.year, this.type, this.profile)
      .pipe(
        withLatestFrom(this.sort, this.itemSort),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(async ([[groupId, year, type, profile], sort, itemSort]) => {
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
          groupId,
        );
        this.sortEvents(sort);
        this.sortItems(itemSort);
      });

    this.sort
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(sort => this.sortEvents(sort));
    this.itemSort
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(sort => this.sortItems(sort));

    combineLatest(this.groups, this.groupId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([groups, groupId]) => {
        this.group = groupId
          ? groups.find(group => group.id === groupId) || null
          : null;
      });

    this.groups.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(groups => {
      this.chartBigbangData = groups.map(
        group =>
          ({
            id: group.id,
            innerAmount: group.amount,
            outerAmount: group.budgetAmount,
          }) as ChartBigbangDataRow,
      );
    });

    combineLatest(this.eventId, this.profile, this.year)
      .pipe(
        filter(values => values.every(value => value != null)),
        takeUntilDestroyed(this.destroyRef),
      ) // only if all not null
      .subscribe(([eventId, profile, year]) => {
        if (eventId != null && year != null && profile?.id != null) {
          this.modalService.show(EventDetailModalComponent, {
            initialState: { eventId, profile, year },
            class: "modal-xl",
          });
        }
      });

    this.modalService.onHide
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.selectEvent(null));
  }

  selectBudget(year: string | number | null, replace: boolean = false): void {
    if (!year) return;
    this.modifyParams({ rok: year, akce: null }, true);
  }

  selectGroup(groupId: string | null, preserveScroll: boolean = false): void {
    if (groupId === undefined) return;

    if (preserveScroll) this.preserveScrollAfterNextNavigation();

    this.modifyParams({ skupina: groupId, akce: null }, true);
  }

  selectAccountingOverview(overview: AccountingOverview): void {
    this.accountingOverview = overview;
  }

  selectEvent(eventId: number | null): void {
    this.modifyParams({ akce: eventId }, false);
  }

  async getGroups(profile: Profile, type: AccountingGroupType, year: number) {
    const groups = await this.accountingService.getGroups(profile, type, year);
    groups.sort((a, b) =>
      a.name && b.name ? a.name.localeCompare(b.name) : 0,
    );
    this.groups.next(groups);
    return groups;
  }

  selectSort(sort: string) {
    if (sort === undefined) return;
    this.modifyParams({ razeni: sort }, false);
  }

  selectItemSort(sort: ItemSort) {
    if (!isItemSort(sort)) return;
    this.modifyParams({ itemSort: sort }, false);
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
      new Date(year, 0, 1),
    );
  }

  sortEvents(sort: string) {
    switch (sort) {
      case "abecedne":
        this.groupEvents.sort((a, b) =>
          a.name && b.name ? a.name.localeCompare(b.name) : 0,
        );
        break;

      case "nejvetsi":
        this.groupEvents.sort((a, b) => b.budgetAmount - a.budgetAmount);
        break;
    }

    this.cdRef.detectChanges(); // sorting would not be detected by change detector
  }

  sortItems(sort: ItemSort) {
    const [field, direction] = sort.split("-") as [
      "number" | "budget" | "actual",
      "ascending" | "descending",
    ];
    const multiplier = direction === "ascending" ? 1 : -1;

    for (const event of this.groupEvents) {
      event.items?.sort((a, b) => {
        const aValue =
          field === "number"
            ? a.id
            : field === "budget"
              ? a.budgetAmount
              : a.amount;
        const bValue =
          field === "number"
            ? b.id
            : field === "budget"
              ? b.budgetAmount
              : b.amount;

        if (aValue == null) return bValue == null ? 0 : 1;
        if (bValue == null) return -1;
        return (aValue - bValue) * multiplier;
      });
    }

    this.cdRef.detectChanges();
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

  private preserveScrollAfterNextNavigation(): void {
    const position = this.viewportScroller.getScrollPosition();

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        take(1),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        setTimeout(() => this.viewportScroller.scrollToPosition(position));
      });
  }
}
