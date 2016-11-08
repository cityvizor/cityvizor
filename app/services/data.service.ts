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
			return this._http.get("/api/entities").toPromise().then(response => response.json());
	}

	getEntity(ico) { 
		return this._http.get("/api/entities/" + ico).toPromise().then(response => response.json());
	}

	saveEntity(ico,data){
		data.test = "ahoj";
		return this._http.post("/api/entities/" + ico,data).toPromise().then(response => response.json());
	}
	
	getCSV(path){
		return new Observable(observer => {
			PapaParse.parse(path, {
				download: true,
				//step: result => observer.next(result.data),
				complete: (result) => {
					observer.next(result.data);
					observer.complete();
				}
			});
		});
	}

	getExpenditures(ico,year){
		
		if(!year) year = (new Date()).getFullYear();
		
		var path = "/api/vydaje/" + ico + "/" + year;
		
		return this.getCSV(path);
		
	}	
	
}