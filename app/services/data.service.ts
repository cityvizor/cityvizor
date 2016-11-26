import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

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
		return this._http.post("/api/entities/" + ico,data).toPromise().then(response => response.json());
	}

	saveEntityData(ico: string, view: string, viewData: any){
		var entity = {data: {}};
		entity.data[view] = viewData;
		return this._http.post("/api/entities/" + ico,entity).toPromise().then(response => response.json());
	}

	getExpenditures(ico,year){
		
		if(!year) year = (new Date()).getFullYear();
		
		return this._http.get("/api/vydaje/" + ico + "/" + year).toPromise().then(response => response.json());
		
	}	
	
}