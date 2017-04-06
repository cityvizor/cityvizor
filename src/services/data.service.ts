import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import { FileUploader } from 'ng2-file-upload/file-upload/file-uploader.class';

import { UserService } from "./user.service";

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
	
	constructor(private http: Http, private authHttp: AuthHttp, private userService:UserService) { }

	/* ENTITIES */
	getEntities() {
			return this.http.get("/api/entities").toPromise().then(response => response.json());
	}

	getEntity(entityId){
		return this.http.get("/api/entities/" + entityId).toPromise().then(response => response.json());
	}
	
	/* PROFILES */
	getProfiles() {
			return this.http.get("/api/profiles").toPromise().then(response => response.json());
	}

	getProfile(profileId) {
		return this.http.get("/api/profiles/" + profileId).toPromise().then(response => response.json());
	}
	
	saveProfile(profile){
		return this.authHttp.post("/api/profiles/" + profile._id,profile).toPromise().then(response => response.json());
	}
	
	getProfileBudget(profileId,year){
		if(!year) year = (new Date()).getFullYear();
		return this.http.get("/api/profiles/" + profileId + "/budgets/" + year).toPromise().then(response => response.json());
	}
	
	getProfileBudgets(profileId){
		return this.http.get("/api/profiles/" + profileId + "/budgets").toPromise().then(response => response.json());
	}
	
	getProfileDashboardDashboard(profileId){
		return this.http.get("/api/profiles/" + profileId + "/dashboard").toPromise().then(response => response.json());
	}
	
	getProfileEvent(profileId,eventId){
		return this.http.get("/api/profiles/" + profileId + "/events/" + eventId).toPromise().then(response => response.json());
	}

	getProfileEvents(profileId){
		return this.http.get("/api/profiles/" + profileId + "/events").toPromise().then(response => response.json());
	}
	
	getProfileEventsTimeline(profileId,year){
		return this.http.get("/api/profiles/" + profileId + "/events/timeline/" + year).toPromise().then(response => response.json());
	}
	
	getProfileLatestInvoices(profileId){
		return this.http.get("/api/profiles/" + profileId + "/invoices/latest").toPromise().then(response => response.json());
	}
	
	getProfileManagers(profileId){
		return this.authHttp.get("/api/profiles/" + profileId + "/managers").toPromise().then(response => response.json());
	}
	


	/* EVENTS */
	getEvent(eventId){
		return this.http.get("/api/events/" + eventId).toPromise().then(response => response.json());
	}
	
	getEvents(){
		return this.http.get("/api/events").toPromise().then(response => response.json());
	}
	
	
	
	/* IMPORT */
	getExpendituresUploader(profileId,year){
		if(!profileId || !year) return null;
		return new FileUploader({
			url: "/api/import/expenditures/",
			authToken: "Bearer " + this.userService.getToken(),
			autoUpload: true,
			additionalParameter: {
				profile: profileId,
				year: year
			}
		});
	}
	
	getEventsUploader(profileId){
		if(!profileId) return null;
		return new FileUploader({
			url: "/api/import/events/",
			authToken: "Bearer " + this.userService.getToken(),
			autoUpload: true,
			additionalParameter: {
				profile: profileId
			}
		});
	}
	
	
	/* USERS */	
	getUsers(){
		return this.authHttp.get("/api/users").toPromise().then(response => response.json());
	}
	
}