import { Component, Input, /*Output, EventEmitter*/ } from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'chart-event-overview',
	templateUrl: 'chart-event-overview.component.html',
	styleUrls: ['chart-event-overview.component.css']
})
export class ChartEventOverviewComponent {

	amount:number;
	invoices:number;
	other:number;
	over:boolean;
	
	currentYear:boolean;
	
	keys:any = {
		"expenditure": {
			amount: "expenditureAmount",
			budgetAmount: "budgetExpenditureAmount",
			paymentsAmount: "paymentsExpenditureAmount"
		},
		"income": {
			amount: "incomeAmount",
			budgetAmount: "budgetIncomeAmount",
			paymentsAmount: "paymentsIncomeAmount"
		}
	};
			

	@Input() type:any;
	
	@Input()
	set data(data:any){
		
		this.currentYear = (data.year === (new Date()).getFullYear());

		let keys = this.keys[this.type];

		let overdraft = Math.max(0, data[keys.amount] - data[keys.budgetAmount]);
				
		// the amount spent/received minus overdraft if any
		this.amount = overdraft ? ((data[keys.amount] - overdraft) / data[keys.amount]) : (data[keys.amount] / data[keys.budgetAmount]);
		
		// part of amount that is covered by invoices
		this.invoices = Math.min(1, data[keys.paymentsAmount] / (data[keys.amount] - overdraft));
		this.other = 1 - this.invoices;

		this.over = !!overdraft;
		
	};
	
	minWidth:number = 0;
		 

	constructor(){ }
	
}