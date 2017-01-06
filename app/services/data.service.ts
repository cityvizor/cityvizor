import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

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
	
	constructor(private http: Http, private authHttp: AuthHttp) {}

	/* ENTITIES */
	getEntities() {
			return this.http.get("/api/entities").toPromise().then(response => response.json());
	}

	getEntity(id) { 
		return this.http.get("/api/entities/" + id).toPromise().then(response => response.json());
	}
	
	/* PROFILES */
	getProfiles() {
			return this.http.get("/api/profiles").toPromise().then(response => response.json());
	}

	getProfile(id) {
		return this.http.get("/api/profiles/" + id).toPromise().then(response => response.json());
	}
	
	saveProfile(profile){
		return this.authHttp.post("/api/profiles/" + profile._id,profile).toPromise().then(response => response.json());
	}

	/* DASHBOARD */
	getDashboard(id){
		return this.http.get("/api/prehled/" + id).toPromise().then(response => response.json());
	}

	/* EXPENDITURES */
	getBudget(id,year){
		if(!year) year = (new Date()).getFullYear();
		return this.http.get("/api/expenditures/budget/" + id + "/" + year).toPromise().then(response => response.json());
	}	

	getExpendituresUploader(profileId,year){
		if(!profileId || !year) return null;
		var url = "/api/expenditures/import/" + profileId + "/" + year;
		return new FileUploader({
			url: url,
			authToken: "Bearer " + window.localStorage.getItem("id_token")
		});
	}

	getExpenditureEvent(profileId,eventId){
		return this.http.get("/api/expenditures/events/" + eventId).toPromise().then(response => response.json());
	}
	
	getExpenditureEvents(profileId){
		return this.http.get("/api/expenditures/events" + profileId).toPromise().then(response => response.json());
	}
	
	getNoticeBoardIds(profileId){
		return this.http.get("/api/uredni-desky/" + profileId + "/ids").toPromise().then(response => response.json());
	}
	
}