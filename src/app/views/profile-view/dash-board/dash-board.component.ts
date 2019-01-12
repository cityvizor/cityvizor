import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { DataService } from '../../../services/data.service';

import { Dashboard } from "../../../shared/schema/dashboard";

@Component({
	moduleId: module.id,
	selector: 'dash-board',
	templateUrl: 'dash-board.component.html',
	styleUrls: ["dash-board.component.scss"]
})
export class DashboardComponent {
	
	@Input()
	profile:any;

 	payments = [];
	contracts = [];
	budgets = [];
	 
	maxBudgetAmount:number = 0;
	 
	maxExpenditureAmount:number = 0;
	maxIncomeAmount:number = 0;

	dashboard:Dashboard;

	constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute){
	}
	 
	ngOnInit(){
		this.dataService.getProfilePayments(this.profile._id,{limit:5,sort:"-date"})
			.then(payments => this.payments = payments.docs)
		
		this.dataService.getProfileContracts(this.profile._id,{limit:5,sort:"-date"})
			.then(contracts => this.contracts = contracts)
		
		this.dataService.getProfileDashboard(this.profile._id)
			.then(dashboard => this.dashboard = dashboard)
		
		this.dataService.getProfileBudgets(this.profile._id,{limit:3,sort:"-year"})
			.then(budgets => this.budgets = budgets)
			.then(budgets => {
				/*budgets.map(budget => this.maxExpenditureAmount = Math.max(this.maxExpenditureAmount,budget.expenditureAmount));
				budgets.map(budget => this.maxIncomeAmount = Math.max(this.maxIncomeAmount,budget.incomeAmount));*/
				this.maxBudgetAmount = 0;
				budgets.forEach(budget => this.maxBudgetAmount = Math.max(this.maxBudgetAmount,budget.budgetIncomeAmount,budget.incomeAmount,budget.budgetExpenditureAmount,budget.expenditureAmount));
			});
	}
	
	openBudget(type:string,year:number):void{
		if(type === 'inc') this.router.navigate(["../prijmy",{rok:year}],{relativeTo:this.route});
		if(type === 'exp') this.router.navigate(["../vydaje",{rok:year}],{relativeTo:this.route});
	}

	
	 

}
