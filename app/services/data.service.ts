import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import { FileUploader } from 'ng2-file-upload/file-upload/file-uploader.class';

/**
	* Service to communicate with server database
	* getEntities - returns Promise with the list of entities, possibly filtered by filter:object parameter
	* getEntity - returns Promise with single entity
	* saveEntity - updates entity and returns Promise with updated data on entity
	* getDashboard - returns Promise with dashboard data
	* getExpenditures - returns Promise with expenditures data for entity and year
	* getExpendituresUploader - returns ng2-file-uploader FileUploader class ready to be attached to input or dropzone
	**/
@Injectable()
export class DataService {
	
	constructor(private _http: Http) {}

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