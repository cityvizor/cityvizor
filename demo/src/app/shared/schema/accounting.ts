
export class AccountingPayment {
	_id: string;
	type: string;
	date: Date;
	id: string;
	counterpartyId: string;
	counterpartyName: string;
	amount: number;
	description: string;
	paragraph: number;
	item: number;
	event: string;
	unit: number;
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
	event: number;
	unit: number;
	budgetAmount: number = 0;
	amount: number = 0;
}

export class AccountingData {
	payments: AccountingPayment[] = [];
	records: AccountingRecord[] = [];
	events: AccountingEvent[] = [];
};