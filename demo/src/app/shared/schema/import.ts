import { Observable } from "rxjs";

export class ImportedRecord {
	paragraph: number;
	item: number;
	event: number;
	unit: number;
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
	unit: number;
}

export class ImportedEvent {
	syntheticAccount?: number;
	srcId: number;
	name: string;
}

export class ImportedData {
	payments: ImportedPayment[] = [];
	records: ImportedRecord[] = [];
	events: ImportedEvent[] = [];
};