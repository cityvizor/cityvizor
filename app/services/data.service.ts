import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import { FileUploader } from 'ng2-file-upload/file-upload/file-uploader.class';

@Injectable()
export class DataService {

	cache = {
		entities: null
	};
	
	constructor(private _http: Http) {
	}

	/* ENTITIES */
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

	/* DASHBOARD */
	getDashboard(ico){
		return this._http.get("/api/prehled/" + ico).toPromise().then(response => response.json());
	}

	/* EXPENDITURES */
	getExpenditures(ico,year){
		if(!year) year = (new Date()).getFullYear();
		return this._http.get("/api/vydaje/" + ico + "/" + year).toPromise().then(response => response.json());
	}	

	getExpendituresUploader(ico,year){
		if(!ico || !year) return null;
		var url = "/api/vydaje/" + ico + "/" + year;
		return new FileUploader({url: url});
	}
	
}