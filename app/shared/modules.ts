import { Module } from "./schema";

export const MODULES: Module[] = [
	{"id": "prehled", "name": "Přehled", "optional": false, "icon": "fa fa-tasks"},
	{"id": "vydaje", "name": "Výdaje", "optional": true, "icon": "fa fa-money"},
	{"id": "prijmy", "name": "Příjmy", "optional": true, "icon": "fa fa-money"},
	{"id": "uredni-deska", "name": "Úřední deska", "optional": true, "icon": "fa fa-newspaper-o"},
	{"id": "prezkum-hospodareni", "name": "Přezkum hospodaření", "optional": true, "icon": "glyphicon glyphicon-scale"},
	{"id": "datove-zdroje", "name": "Datové zdroje", "optional": false, "icon": "glyphicon glyphicon-download-alt"}
];