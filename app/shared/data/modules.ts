export class Module {
	public id: string;
	public url: string;
	public name: string;
	public optional: boolean;
}

export const MODULES: Module[] = [
	{"id": "dash-board", "url": "prehled", "name": "Přehled", "optional": false},
	{"id": "expenditure-viz", "url": "rozpocet", "name": "Klikací rozpočet", "optional": true},
	{"id": "expenditure-events", "url": "investicni-akce", "name": "Investiční akce", "optional": true},	
	{"id": "notice-board", "url": "uredni-deska", "name": "Úřední deska", "optional": true},
	{"id": "contract-list", "url": "registr-smluv", "name": "Registr smluv", "optional": true},
	{"id": "data-sources", "url": "datove-zdroje", "name": "Datové zdroje", "optional": false},
	{"id": "admin", "url": "admin", "name": "Administrace", "optional": false}
];