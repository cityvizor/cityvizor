import { Observable } from "rxjs";

export class ImportedRecord {
	paragraph: number;
	item: number;
	event: number;
	budgetAmount: number = 0;
	amount: number = 0;
}

export class ImportedPayment {
	date: Date;
	type: string;
	id: string;
	counterpartyId: string;
	counterpartyName: string;
	amount: number;
	description: string;
	paragraph: number;
	item: number;
	event: number;
}

export class ImportedEvent {
	srcId: number;
	name: string;
}

export class ImportedData {
	payments: ImportedPayment[] = [];
	records: ImportedRecord[] = [];
	events: ImportedEvent[] = [];
};