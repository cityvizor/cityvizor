import { Component, Input, /*Output, EventEmitter*/ } from '@angular/core';

@Component({
	selector: 'chart-event-overview',
	templateUrl: 'chart-event-overview.component.html',
	styleUrls: ['chart-event-overview.component.scss']
})
export class ChartEventOverviewComponent {

	amount:number;
	invoices:number;
	other:number;
	over:boolean;
	
	currentYear:boolean;

	@Input() type:any;
	
	@Input()
	set data(data:any){
		
		this.currentYear = (data.year === (new Date()).getFullYear());

		if(this.type === "expenditure"){
			
			let max = data.expenditureAmount < data.budgetExpenditureAmount ? data.budgetExpenditureAmount : 2 * data.expenditureAmount - data.budgetExpenditureAmount;
			
			this.amount = data.expenditureAmount / max;
			this.invoices = data.paymentsExpenditureAmount / data.expenditureAmount;
			this.other = 1 - this.invoices;
			
			this.over = data.expenditureAmount > data.budgetExpenditureAmount;
		}
		
		if(this.type === "income"){
			let max = data.incomeAmount < data.budgetIncomeAmount ? data.budgetIncomeAmount : 2 * data.incomeAmount - data.budgetIncomeAmount;
			
			this.amount = data.incomeAmount / max;
			this.invoices = data.paymentsIncomeAmount / data.incomeAmount;
			this.other = 1 - this.invoices;
			
			this.over = data.incomeAmount > data.budgetIncomeAmount;
		}
	};
	
	//@Output() click:EventEmitter<string> = new EventEmitter();

	 
	minWidth:number = 0;
		 

	constructor(){ }
	
}