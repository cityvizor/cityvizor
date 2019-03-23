
export class AccountingPayment {
	_id: string;
	type: string;
	date: Date;
	id: string;
	counterparty_id: string;
	counterparty_name: string;
	amount: number;
	comment: string;
	paragraph: number;
	item: number;
	event: string;
}

export class AccountingEvent {
	_id: string;
	year: number;
	profile: string;

	srcId: number;
	name: string;
}

export class AccountingRecord {
	_id: string;
	paragraph: number;
	item: number;
	event: string;
	budgetAmount: number = 0;
	amount: number = 0;
}

export class AccountingData {
	payments: AccountingPayment[] = [];
	records: AccountingRecord[] = [];
	events: AccountingEvent[] = [];
};