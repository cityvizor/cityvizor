import { Component, OnInit, inject } from "@angular/core";
import {
  Router,
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
} from "@angular/router";

import { DataService } from "app/services/data.service";

import { Dashboard } from "app/schema/dashboard";
import { ProfileService } from "app/services/profile.service";

import {
  Budget,
  BudgetPayment,
  Contract,
  Profile,
  ProfileSumMode,
} from "app/schema";
import { DatePipe, Location, NgClass } from "@angular/common";
import { ChartHistoryComponent } from "../../../../shared/charts/chart-history/chart-history.component";
import { ChartBudgetComponent } from "../../../../shared/charts/chart-budget/chart-budget.component";
import { MoneyPipe } from "../../../../shared/pipes/money.pipe";
import { AresUrlPipe, IcoPipe } from "../../../../shared/pipes/utils.pipe";
import { TranslatePipe } from "@ngx-translate/core";
import {
  DASHBOARD_FINANCING_TOGGLE,
  FeatureFlagsService,
} from "app/services/feature-flags.service";

@Component({
  selector: "profile-dashboard",
  templateUrl: "profile-dashboard.component.html",
  styleUrls: ["profile-dashboard.component.scss"],
  imports: [
    ChartHistoryComponent,
    NgClass,
    RouterLink,
    RouterLinkActive,
    ChartBudgetComponent,
    DatePipe,
    MoneyPipe,
    IcoPipe,
    AresUrlPipe,
    TranslatePipe,
  ],
})
export class ProfileDashboardComponent implements OnInit {
  private profileService = inject(ProfileService);
  private dataService = inject(DataService);
  private featureFlags = inject(FeatureFlagsService);
  private location = inject(Location);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  profile: Profile;

  payments: BudgetPayment[] = [];
  contracts: Contract[] = [];
  budgets: Budget[] = [];
  private loadedBudgets: Budget[] = [];

  includeFinancing: boolean = true;

  maxBudgetAmount: number = 0;

  maxExpenditureAmount: number = 0;
  maxIncomeAmount: number = 0;

  dashboard: Dashboard | null = null;
  dashboardLoading: boolean = true;
  paymentsLoading: boolean = true;
  budgetsLoading: boolean = true;

  ngOnInit() {
    if (this.financingToggleEnabled) {
      this.includeFinancing =
        this.route.snapshot.queryParamMap.get("financovani") !== "ne";
    }

    this.profileService.profile.subscribe(profile => {
      this.profile = profile;
      this.loadPayments(profile.id);
      this.loadContracts(profile.id);
      this.loadDashboard(profile.id);
      this.loadBudgets(profile.id, profile.sumMode);
    });
  }

  async loadPayments(profileId: number) {
    this.paymentsLoading = true;
    this.payments = [];

    try {
      this.payments = await this.dataService.getProfilePayments(profileId, {
        limit: 10,
        sort: "-date",
      });
    } finally {
      this.paymentsLoading = false;
    }
  }

  async loadContracts(profileId: number) {
    this.contracts = await this.dataService.getProfileContracts(profileId, {
      limit: 5,
      sort: "-date",
    });
  }

  async loadDashboard(profileId: number) {
    this.dashboardLoading = true;
    this.dashboard = null;

    try {
      const dashboard = await this.dataService.getProfileDashboard(profileId);

      this.dashboard = dashboard.reduce((acc, cur) => {
        acc[cur.category].push(cur);
        return acc;
      }, new Dashboard());
    } finally {
      this.dashboardLoading = false;
    }
  }

  async loadBudgets(profileId: number, sumMode: ProfileSumMode) {
    this.budgetsLoading = true;
    this.budgets = [];
    this.loadedBudgets = [];
    this.maxBudgetAmount = 0;

    try {
      if (this.isMunicipality) {
        this.loadedBudgets = await this.dataService.getProfileBudgets(
          profileId,
          {
            limit: 100,
            sumMode,
          },
        );
      } else {
        this.loadedBudgets = await this.dataService.getProfilePlans(profileId);
      }

      this.loadedBudgets.sort((a, b) => b.year - a.year);
      this.updateDisplayedBudgets();
    } finally {
      this.budgetsLoading = false;
    }
  }

  setIncludeFinancing(includeFinancing: boolean): void {
    this.includeFinancing = includeFinancing;
    this.updateDisplayedBudgets();

    const url = this.router.createUrlTree([], {
      relativeTo: this.route,
      queryParams: { financovani: includeFinancing ? null : "ne" },
      queryParamsHandling: "merge",
    });
    this.location.replaceState(this.router.serializeUrl(url));
  }

  private updateDisplayedBudgets(): void {
    const adjustFinancing = this.financingToggleEnabled && this.isMunicipality;

    this.budgets = this.loadedBudgets.map(budget => {
      if (!adjustFinancing) return { ...budget };

      const incomeWithoutFinancing =
        budget.incomeWithoutFinancingAmount ??
        budget.incomeAmount - (budget.financingAmount ?? 0);
      const budgetIncomeWithoutFinancing =
        budget.budgetIncomeWithoutFinancingAmount ??
        budget.budgetIncomeAmount - (budget.budgetFinancingAmount ?? 0);

      return {
        ...budget,
        incomeAmount:
          incomeWithoutFinancing +
          (this.includeFinancing ? (budget.financingAmount ?? 0) : 0),
        budgetIncomeAmount:
          budgetIncomeWithoutFinancing +
          (this.includeFinancing ? (budget.budgetFinancingAmount ?? 0) : 0),
      };
    });

    this.maxBudgetAmount = this.budgets.reduce((acc, budget) => {
      return Math.max(
        acc,
        budget.budgetIncomeAmount,
        budget.incomeAmount,
        budget.budgetExpenditureAmount,
        budget.expenditureAmount,
      );
    }, 0);
  }

  openBudget(type: string, year: number): void {
    if (type === "inc")
      this.router.navigate(["./hospodareni/prijmy", { rok: year }], {
        relativeTo: this.route.parent,
      });
    if (type === "exp")
      this.router.navigate(["./hospodareni/vydaje", { rok: year }], {
        relativeTo: this.route.parent,
      });
  }

  openExpenditures(group: number, year?: number) {
    const yearToOpen =
      typeof year === "number" ? year : (this.budgets[0]?.year ?? 0);
    this.router.navigate(
      ["./hospodareni/vydaje", { rok: yearToOpen, skupina: group }],
      { relativeTo: this.route.parent },
    );
  }

  get onlyPayments() {
    return this.contracts.length == 0;
  }

  get isMunicipality() {
    return this.profile?.type === "municipality";
  }

  get financingToggleEnabled() {
    return this.featureFlags.isEnabled(DASHBOARD_FINANCING_TOGGLE);
  }

  get hasFinancing() {
    return this.loadedBudgets.some(
      budget =>
        (budget.financingAmount ?? 0) !== 0 ||
        (budget.budgetFinancingAmount ?? 0) !== 0,
    );
  }
}
