import { Component, Input, Output, EventEmitter, OnChanges, forwardRef } from '@angular/core';

import { Budget } from 'app/schema';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'budget-select',
	templateUrl: 'budget-select.component.html',
	styleUrls: ['budget-select.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => BudgetSelectComponent),
			multi: true
		}
	]
})
export class BudgetSelectComponent implements OnChanges, ControlValueAccessor {

	@Input() budgets: Budget[] = [];

	@Input() type: string | null;

	@Input("selected") selectedBudget: Budget;

	@Output() select: EventEmitter<any> = new EventEmitter();

	open: boolean;
	maxAmount: number = 0;

	onChange: any = () => { };
	onTouch: any = () => { };

	constructor() { }

	registerOnChange(fn: any) { this.onChange = fn; }
	registerOnTouched(fn: any) { this.onTouch = fn; }

	writeValue(budget: Budget) {
		this.selectedBudget = budget;
	}

	selectBudget(budget: Budget) {
		this.selectedBudget = budget;
		this.onTouch();
		this.onChange(budget);
	}

	ngOnChanges() {
		this.updateMax();
	}

	updateMax() {
		if (!this.budgets) { this.maxAmount = 0; return; }
		this.maxAmount = this.budgets.reduce((acc, cur) => Math.max(acc, this.getAmount(cur), this.getBudgetAmount(cur)), 0);
	}

	getAmount(budget: Budget): number {
		if (!budget) return 0;
		if (this.type === "exp") return budget.expenditureAmount;
		if (this.type === "inc") return budget.incomeAmount;
		return 0;
	}

	getBudgetAmount(budget: Budget): number {
		if (!budget) return 0;
		if (this.type === "exp") return budget.budgetExpenditureAmount;
		if (this.type === "inc") return budget.budgetIncomeAmount;
		return 0;
	}


}