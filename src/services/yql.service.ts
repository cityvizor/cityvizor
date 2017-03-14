import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

/**
	* Service to communicate with Yahoo Queries
	**/
@Injectable()
export class YQLService {
	
	yql_path = "https://query.yahooapis.com/v1/public/yql";
	
	constructor(private http: Http) {}

	/* ENTITIES */
	query(queryString) {
		
		// construct path
		var path = this.yql_path + "?format=json&q=" + encodeURIComponent(queryString);
		
		// create promie to download path
		return this.http.get(path).toPromise().then(response => response.json());
	}
	
}