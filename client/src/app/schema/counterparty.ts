import { BudgetPayment } from './budget';

export class Counterparty {
	amount: number = 0;
	payments: BudgetPayment[] = [];
	profiles: CounterpartyProfile[] = [];

	constructor(public id: string | null, public name: string) { }

}

export interface CounterpartyProfile {
	id: string;
	name: string;
	budgets: CounterpartyProfileBudget[];
	averageAmount?: number;
}


export interface CounterpartyProfileBudget {
	year: number;
	etl?: string;
	amount: number;
}