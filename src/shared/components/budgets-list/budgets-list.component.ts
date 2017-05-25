import { Component, Input, Output, EventEmitter } from '@angular/core';

import { DataService } from '../../../services/data.service';

@Component({
	moduleId: module.id,
	selector: 'budgets-list',
	templateUrl: 'budgets-list.template.html',
	styleUrls: ['budgets-list.style.css']
})
export class BudgetsListComponent{
	
	/* DATA */
	@Input()
  set profile(profile:string){
    if(profile) this.loadBudgets(profile);
  };

  @Input()
	type:string;
  
  @Output()
  select:EventEmitter<any> = new EventEmitter();

  // array of budgets
	budgets:any[];

  // current selected budget
  selectedBudget:any;

  open:boolean;

  // max budgeted amount
  maxAmount:number = 0;

	constructor(private dataService: DataService){ }

	loadBudgets(profileId):void{
		this.dataService.getProfileBudgets(profileId,{sort:"-year"})
			.then(budgets => {
				
			  this.budgets = budgets;
				this.maxAmount = 0;
      
				this.budgets.forEach(budget => this.maxAmount = Math.max(this.maxAmount,this.getAmount(budget),this.getBudgetAmount(budget)));
      
				if(this.budgets[0]) this.selectBudget(this.budgets[0]);
			});
	}

  getBudgetAmount(budget):number{
   switch(this.type){
     case "expenditures": return budget.budgetExpenditureAmount;
     case "income": return budget.budgetIncomeAmount;
     default: return 0;
   }
  }

  getAmount(budget):number{
   switch(this.type){
     case "expenditures": return budget.expenditureAmount;
     case "income": return budget.incomeAmount;
     default: return 0;
   }
  }

	getType():string{
		switch(this.type){
			case "expenditures": return "výdaje";
			case "income": return "příjmy";
			default: return "";
		}
	}

  selectBudget(budget):void{
    this.selectedBudget = budget;
    this.select.emit(this.selectedBudget);
  }
	
}