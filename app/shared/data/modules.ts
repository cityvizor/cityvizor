export class Module {
	public id: string;
	public url: string;
	public name: string;
	public optional: boolean;
	public icon: string;
}

export const MODULES: Module[] = [
	{"id": "dash-board", "url": "prehled", "name": "Přehled", "optional": false, "icon": "fa fa-tasks"},
	{"id": "expenditure-viz", "url": "rozpocet", "name": "Klikací rozpočet", "optional": true, "icon": "fa fa-money"},
	{"id": "expenditure-events", "url": "investicni-akce", "name": "Investiční akce", "optional": true, "icon": "fa fa-money"},	
	{"id": "notice-board", "url": "uredni-deska", "name": "Úřední deska", "optional": true, "icon": "fa fa-newspaper-o"},
	{"id": "management-review", "url": "prezkum-hospodareni", "name": "Přezkum hospodaření", "optional": true, "icon": "glyphicon glyphicon-scale"},
	{"id": "data-sources", "url": "datove-zdroje", "name": "Datové zdroje", "optional": false, "icon": "glyphicon glyphicon-download-alt"}
];