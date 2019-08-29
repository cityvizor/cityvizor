import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { DataService } from 'app/services/data.service';

import { Dashboard } from "app/schema/dashboard";
import { ProfileService } from '../../services/profile.service';

import { Budget, BudgetPayment, Counterparty, Contract } from 'app/schema';

@Component({
	selector: 'profile-dashboard',
	templateUrl: 'profile-dashboard.component.html',
	styleUrls: ["profile-dashboard.component.scss"]
})
export class ProfileDashboardComponent {

	@Input()
	profile: any;

	payments:BudgetPayment[] = [];
	contracts:Contract[] = [];
	budgets:Budget[] = [];

	maxBudgetAmount: number = 0;

	maxExpenditureAmount: number = 0;
	maxIncomeAmount: number = 0;

	dashboard: Dashboard;

	constructor(private profileService: ProfileService, private dataService: DataService, private router: Router, private route: ActivatedRoute) {
	}

	ngOnInit() {

		this.profileService.profile.subscribe(profile => {
			this.loadPayments(profile.id);
			this.loadContracts(profile.id);
			this.loadDashboard(profile.id);
			this.loadBudgets(profile.id);
		})

	}

	async loadPayments(profileId: string) {
		this.payments = await this.dataService.getProfilePayments(profileId, { limit: 5, sort: "-date" })
	}

	async loadContracts(profileId: string) {
		this.contracts = await this.dataService.getProfileContracts(profileId, { limit: 5, sort: "-date" })
	}
	
	async loadDashboard(profileId: string) {
		const dashboard = await this.dataService.getProfileDashboard(profileId)
		
		this.dashboard = dashboard.reduce((acc, cur) => {
			acc[cur.category].push(cur);
			return acc;
		}, new Dashboard());

		console.log(this.dashboard);
		
	}

	async loadBudgets(profileId: string) {
		this.budgets = await this.dataService.getProfileBudgets(profileId, { limit: 3 });
		this.maxBudgetAmount = this.budgets.reduce((acc, budget) => {
			return Math.max(acc, budget.budgetIncomeAmount, budget.incomeAmount, budget.budgetExpenditureAmount, budget.expenditureAmount);
		}, 0);
	}

	openBudget(type: string, year: number): void {
		if (type === 'inc') this.router.navigate(["../prijmy", { rok: year }], { relativeTo: this.route });
		if (type === 'exp') this.router.navigate(["../vydaje", { rok: year }], { relativeTo: this.route });
	}

}
