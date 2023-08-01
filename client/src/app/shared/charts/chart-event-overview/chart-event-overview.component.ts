import { Component, Input, /*Output, EventEmitter*/ } from '@angular/core';
import { BudgetEvent } from 'app/schema';

@Component({
	moduleId: module.id,
	selector: 'chart-event-overview',
	templateUrl: 'chart-event-overview.component.html',
	styleUrls: ['chart-event-overview.component.scss']
})
export class ChartEventOverviewComponent {

	amount: number;
	invoices: number;
	other: number;
	over: boolean;

	keys: any = {
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

	@Input() isCurrentYear: boolean;

	@Input() type: any;

	@Input()
	set event(event: BudgetEvent) {

		let keys = this.keys[this.type];

		let overdraft = Math.max(0, event[keys.amount] - event[keys.budgetAmount]);

		// the amount spent/received minus overdraft if any
		this.amount = overdraft ? ((event[keys.amount] - overdraft) / event[keys.amount]) : (event[keys.amount] / event[keys.budgetAmount]);

		const paymentsAmount = event.payments ? event.payments.reduce((acc, cur) => acc + cur[keys.amount], 0) : 0;

		// part of amount that is covered by invoices
		this.invoices = Math.min(1, paymentsAmount / (event[keys.amount] - overdraft));
		this.other = 1 - this.invoices;

		this.over = !!overdraft;

	};

	minWidth: number = 0;


	constructor() { }

}