export class Module {
	public id: string;
	public url: string;
	public name: string;
	public optional: boolean;
}

export const MODULES: Module[] = [
	{"id": "dash-board", "url": "prehled", "name": "Aktuálně", "optional": false},
	{"id": "budget-viz", "url": "rozpocet", "name": "Rozpočet", "optional": true},
	{"id": "expenditure-viz", "url": "vydaje", "name": "Výdaje", "optional": true},
	{"id": "income-viz", "url": "prijmy", "name": "Příjmy", "optional": true},	
	{"id": "expenditure-events", "url": "investicni-akce", "name": "Investice", "optional": true},	
	{"id": "notice-board", "url": "uredni-deska", "name": "Úřední deska", "optional": true},
	{"id": "contract-list", "url": "registr-smluv", "name": "Registr smluv", "optional": true},
	{"id": "data-catalogue", "url": "datovy-katalog", "name": "Datový katalog", "optional": true}
];