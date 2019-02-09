export class Counterparty {
	_id: string;
	name: string;
	profiles: CounterpartyProfile[];
	amount:number;
}

export class CounterpartyProfile {
	_id: string;
	name: string;
	budgets: CounterpartyProfileBudget[];
	averageAmount?: number;
}


export class CounterpartyProfileBudget {
	year: number;
	etl?: string;
	amount: number;
}