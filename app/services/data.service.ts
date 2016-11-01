import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import * as PapaParse from 'papaparse';

@Injectable()
export class DataService {

	cache = {
		entities: null
	};
	
	constructor(private _http: Http) {
	}

	filterEntities(filter){

		var allowedFilters = ["type","ico"];
		
		return this.cache.entities.filter(element => {
			var ok = true;
			allowedFilters.forEach(function(item,i){
				if(filter[item] && element[item] !== filter[item]) ok = false;
			});
			return ok;
		});
	}

	getEntities(filter) {
		return new Promise<any[]>((resolve, reject) => {
			if (this.cache.entities !== null) return resolve(this.filterEntities(filter));
			this._http.get("/data/entities.json").toPromise().then(response => {this.cache.entities = response.json(); resolve(this.filterEntities(filter));});
		});
	}

	getEntity(ico) { 
		return this.getEntities({ico:ico}).then(entities => entities[0]);
	}
	
	getCSV(path){
		return new Observable(observer => {
			PapaParse.parse(path, {
				download: true,
				step: row => observer.next(row.data),
				complete: () => observer.complete()
			});
		});
	}

	getExpenditures(ico,year){
		
		if(!year) year = (new Date()).getFullYear();
		
		var path = "/data/" + ico + "/expenditures_" + year + ".csv";
		
		return this.getCSV(path);
		
	}	
	
}