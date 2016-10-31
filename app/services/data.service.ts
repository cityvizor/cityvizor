import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import * as PapaParse from 'papaparse';

@Injectable()
export class DataService {

	data = {
		entities: null,
		budgetGroups: null
	};
	
	constructor(private _http: Http) {
	}

	filterEntities(filter){

		var allowedFilters = ["type","ico"];
		
		return this.data.entities.filter(element => {
			var ok = true;
			allowedFilters.forEach(function(item,i){
				if(filter[item] && element[item] !== filter[item]) ok = false;
			});
			return ok;
		});
	}

	getEntities(filter) {
		return new Promise<any[]>((resolve, reject) => {
			if (this.data.entities !== null) return resolve(this.filterEntities(filter));
			this._http.get("/data/entities.json").toPromise().then(response => {this.data.entities = response.json(); resolve(this.filterEntities(filter));});
		});
	}

	getEntity(ico) { 
		return this.getEntities({ico:ico}).then(entities => entities[0]);
	}

	getBudgetGroups(){
		return new Promise((resolve, reject) => {
			if (this.data.budgetGroups !== null) return resolve(this.data.budgetGroups);
			this._http.get("/data/budget-groups.json").toPromise().then(response => {this.data.budgetGroups = response.json(); resolve(this.data.budgetGroups);});			
		});
	}
	
	getCSV(path){
		return new Promise(function(resolve,reject){
			PapaParse.parse(path, {
				download: true,
				complete: function(results) {
					if(results.errors.length) reject();
					else resolve(results.data);
				}
			});
		});
	}

	getExpendituresPath(ico,year){
		return "/data/" + ico + "/expenditures_" + year + ".csv";
	}

	getExpenditures(ico,year){
		
		if(!year) year = (new Date()).getFullYear();
		
		return this.getCSV(this.getExpendituresPath(ico,year));
		
	}
	
	getBudget(ico,year){
		
		if(!year) year = (new Date()).getFullYear();
		
		var path = "/data/" + ico + "/budget_" + year + ".csv";
		
		return this.getCSV(path);
		
	}

	getBudgetItems(){
		return this.getCSV("/data/budget-items.csv");	
	}

	getBudgetParagraphs(){
		return this.getCSV("/data/budget-paragraphs.csv");	
	}
	
	
	
}