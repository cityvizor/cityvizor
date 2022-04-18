import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { DataService } from 'app/services/data.service';

import { Dashboard } from "app/schema/dashboard";
import { ProfileService } from 'app/services/profile.service';

import { Budget, BudgetPayment, Counterparty, Contract, Profile } from 'app/schema';

@Component({
	selector: 'profile-dashboard',
	templateUrl: 'profile-dashboard.component.html',
	styleUrls: ["profile-dashboard.component.scss"]
})
export class ProfileDashboardComponent {

	profile: Profile;

	payments: BudgetPayment[] = [];
	contracts: Contract[] = [];
	budgets: Budget[] = [];

	maxBudgetAmount: number = 0;

	maxExpenditureAmount: number = 0;
	maxIncomeAmount: number = 0;

	dashboard: Dashboard;

	constructor(private profileService: ProfileService, private dataService: DataService, private router: Router, private route: ActivatedRoute) {
	}

	ngOnInit() {

		this.profileService.profile.subscribe(profile => {
			this.profile = profile;
			this.loadPayments(profile.id);
			this.loadContracts(profile.id);
			this.loadDashboard(profile.id);
			this.loadBudgets(profile.id);
		})

	}

	async loadPayments(profileId: number) {
		this.payments = await this.dataService.getProfilePayments(profileId, { limit: 10, sort: "-date" })
	}

	async loadContracts(profileId: number) {
		this.contracts = await this.dataService.getProfileContracts(profileId, { limit: 5, sort: "-date" })
	}

	async loadDashboard(profileId: number) {
		const dashboard = await this.dataService.getProfileDashboard(profileId)

		this.dashboard = dashboard.reduce((acc, cur) => {
			acc[cur.category].push(cur);
			return acc;
		}, new Dashboard());

	}

	async loadBudgets(profileId: number) {
		
		if (this.isMunicipality) {
			this.budgets = await this.dataService.getProfileBudgets(profileId, { limit: 3 });
		} else {
			this.budgets = await this.dataService.getProfilePlans(profileId);
		}

		this.budgets.sort((a,b) => b.year - a.year);

		this.maxBudgetAmount = this.budgets.reduce((acc, budget) => {
			return Math.max(acc, budget.budgetIncomeAmount, budget.incomeAmount, budget.budgetExpenditureAmount, budget.expenditureAmount);
		}, 0);
	}

	openBudget(type: string, year: number): void {
		if (type === 'inc') this.router.navigate(["./hospodareni/prijmy", { rok: year }], { relativeTo: this.route.parent });
		if (type === 'exp') this.router.navigate(["./hospodareni/vydaje", { rok: year }], { relativeTo: this.route.parent });
	}

	openExpenditures(group: number, year: number) {
		this.router.navigate(["./hospodareni/vydaje", { rok: year, skupina: group }], { relativeTo: this.route.parent });
	}

	get onlyPayments() {
		return this.contracts.length == 0
	}
	
	get isMunicipality() {
		return this.profile?.type === "municipality";
	}

}
