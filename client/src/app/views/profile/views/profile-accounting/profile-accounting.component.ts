import {
  Component,
  OnInit,
  ChangeDetectorRef,
  DestroyRef,
  inject,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { BsModalService } from "ngx-bootstrap/modal";
import { combineLatest, Subject, BehaviorSubject, ReplaySubject } from "rxjs";
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
import { BudgetSelectComponent } from "../../components/budget-select/budget-select.component";
import { FormsModule } from "@angular/forms";
import { ChartBigbangComponent } from "../../../../shared/charts/chart-bigbang/chart-bigbang.component";
import { GroupSelectComponent } from "../../components/group-select/group-select.component";
import { AccountingGroupCardsComponent } from "../../components/accounting-group-cards/accounting-group-cards.component";
import { AsyncPipe, DOCUMENT, Location, SlicePipe } from "@angular/common";
import { ChartDonutComponent } from "../../../../shared/charts/chart-donut/chart-donut.component";
import { MoneyPipe } from "../../../../shared/pipes/money.pipe";
import { TranslatePipe } from "@ngx-translate/core";

type AccountingOverview = "chart" | "cards" | "map" | "bars";

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
  private document = inject(DOCUMENT);
  private location = inject(Location);
  private currentRouteParams: Params = {};
  private groupsRequestId = 0;
  private groupEventsRequestId = 0;

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
  groupEventsLoading = false;
  groupEventsLoadFailed = false;

  hoveredGroup: string | null;
  selectedEvent: number | null;
  accountingOverview: AccountingOverview = "chart";

  eventsLimit: number = 20;

  chartBigbangData: ChartBigbangData;

  typeLocalParams = { vydaje: "exp", prijmy: "inc" };

  async ngOnInit() {
    // route params
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => (this.currentRouteParams = { ...params }));

    this.route.params
      .pipe(
        map(params => this.typeLocalParams[params.type] || null),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(type => {
        this.accountingOverview = "chart";
        this.type.next(type);
      });
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
        const requestId = ++this.groupsRequestId;

        if (!profile || !type || !year) return;

        const groups = await this.accountingService.getGroups(
          profile,
          type,
          year,
        );

        if (requestId !== this.groupsRequestId) return;

        groups.sort((a, b) =>
          a.name && b.name ? a.name.localeCompare(b.name) : 0,
        );
        this.groups.next(groups);
      });

    // download events
    combineLatest(this.groupId, this.year, this.type, this.profile)
      .pipe(withLatestFrom(this.sort), takeUntilDestroyed(this.destroyRef))
      .subscribe(async ([[groupId, year, type, profile], sort]) => {
        const requestId = ++this.groupEventsRequestId;

        if (!profile || !year || !type) {
          this.groupEventsLoading = false;
          return;
        }

        this.resetEventsLimit();

        if (!groupId) {
          this.groupEvents = [];
          this.groupEventsLoading = false;
          this.groupEventsLoadFailed = false;
          return;
        }

        this.groupEvents = [];
        this.groupEventsLoading = true;
        this.groupEventsLoadFailed = false;

        try {
          const groupEvents = await this.accountingService.getGroupEvents(
            profile,
            year,
            type,
            groupId,
          );

          if (requestId !== this.groupEventsRequestId) return;

          this.groupEvents = groupEvents;
          this.groupEventsLoading = false;
          this.sortEvents(sort);
        } catch {
          if (requestId !== this.groupEventsRequestId) return;

          this.groupEventsLoading = false;
          this.groupEventsLoadFailed = true;
        }
      });

    this.sort
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(sort => this.sortEvents(sort));

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

    if (preserveScroll) {
      this.replaceParamsWithoutNavigation({ skupina: groupId, akce: null });
      this.groupId.next(groupId);
      this.eventId.next(null);
      if (groupId) this.scrollSelectedGroupIntoView();
      return;
    }

    this.modifyParams({ skupina: groupId, akce: null }, true);
  }

  selectAccountingOverview(overview: AccountingOverview): void {
    this.accountingOverview = overview;
  }

  selectEvent(eventId: number | null): void {
    this.modifyParams({ akce: eventId }, false);
  }

  selectSort(sort: string) {
    if (sort === undefined) return;
    this.modifyParams({ razeni: sort }, false);
  }

  modifyParams(modificationParams: Params, replace: boolean): void {
    const routeParams = this.applyParamModifications(modificationParams);
    delete routeParams.type;

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

  private replaceParamsWithoutNavigation(modificationParams: Params): void {
    const routeParams = this.applyParamModifications(modificationParams);
    delete routeParams.type;

    const urlTree = this.router.createUrlTree(["./", routeParams], {
      relativeTo: this.route,
    });
    this.location.replaceState(this.router.serializeUrl(urlTree));
  }

  private applyParamModifications(modificationParams: Params): Params {
    const routeParams = { ...this.currentRouteParams };

    Object.entries(modificationParams).forEach(([key, value]) => {
      if (value !== null) routeParams[key] = value;
      else delete routeParams[key];
    });

    this.currentRouteParams = { ...routeParams };
    return routeParams;
  }

  private scrollSelectedGroupIntoView(): void {
    const window = this.document.defaultView;
    if (!window) return;

    window.requestAnimationFrame(() => {
      const selectedGroup = this.document.getElementById("selectedGroup");
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches
        ? "auto"
        : "smooth";

      selectedGroup?.scrollIntoView({ behavior, block: "start" });
    });
  }
}
