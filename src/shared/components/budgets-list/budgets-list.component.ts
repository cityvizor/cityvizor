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
  
	@Input()
	set selected(year:number){
		if(year !== this.selectedYear) this.selectBudget(year);
	}
	
	@Output()
  select:EventEmitter<any> = new EventEmitter();

  // array of budgets
	budgets:any[] = [];

  // current selected budget
	selectedYear:number;
  currentBudget:any;

  open:boolean;

  // max budgeted amount
  maxAmount:number = 0;

	constructor(private dataService: DataService){ }
	
	ngOnChanges(){
		this.updateMax();
	}

	loadBudgets(profileId):void{
		this.dataService.getProfileBudgets(profileId,{sort:"-year"})
			.then(budgets => {
				
			  this.budgets = budgets;
				this.maxAmount = 0;
      
				this.updateMax();
      	
				this.selectBudget(this.selectedYear);
			});
		
	}
	
	updateMax(){
		this.budgets.forEach(budget => this.maxAmount = Math.max(this.maxAmount,this.getAmount(budget),this.getBudgetAmount(budget)));
	}

  getBudgetAmount(budget):number{
   switch(this.type){
     case "exp": return budget.budgetExpenditureAmount;
     case "inc": return budget.budgetIncomeAmount;
     default: return 0;
   }
  }

  getAmount(budget):number{
   switch(this.type){
     case "exp": return budget.expenditureAmount;
     case "inc": return budget.incomeAmount;
     default: return 0;
   }
  }

	getType():string{
		switch(this.type){
			case "exp": return "výdaje";
			case "inc": return "příjmy";
			default: return "";
		}
	}

  selectBudget(year:number):void{

		this.selectedYear = year;
		
		if(year && this.budgets){

			// search for budget
			let budget;
			this.budgets.some(item => {
				if(Number(item.year) === year) {budget = item; return true;}
				return false;
			});
			
			if(budget){
				this.currentBudget = budget;
				this.select.emit(this.currentBudget);
				return;
			}
		}
		
		// select first if not found and budgets loaded
		if(this.budgets[0]){
			this.currentBudget = this.budgets[0];
			this.select.emit(this.currentBudget);
			return;
		}
		
		// set null if no budgets
		this.currentBudget = null;
		
  }
	
}