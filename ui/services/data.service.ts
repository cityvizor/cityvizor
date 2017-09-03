import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

import { FileUploader } from 'ng2-file-upload/file-upload/file-uploader.class';

import { AuthService } from "./auth.service";

function toParams(options){
	if(!options) return "";
	
	var params = Object.keys(options)
		.map(key => {
			if(typeof options[key] === "object") return Object.keys(options[key]).map(key2 => key + "[" + key2 + "]=" + options[key][key2]).join("&");
			else return key + "=" + options[key];
		})
		.join("&");
	
	return "?" + params;
}

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
	
	constructor(private http: AuthHttp, private authService:AuthService) { }
	
	
	/* PROFILES */
	getProfiles(options?) {
			return this.http.get("/api/profiles" + toParams(options)).toPromise().then(response => response.json());
	}

	getProfile(profileId) {
		return this.http.get("/api/profiles/" + profileId).toPromise().then(response => response.json());
	}
	
	createProfile(profile){
		return this.http.post("/api/profiles",profile).toPromise().then(response => response.json());
	}
	
	saveProfile(profile){
		return this.http.put("/api/profiles/" + profile._id,profile).toPromise().then(response => response.json());
	}
	
	saveProfileAvatar(profileId,data:FormData){
		return this.http.put("/api/profiles/" + profileId + "/avatar",data).toPromise();
	}
	deleteProfileAvatar(profileId){
		return this.http.delete("/api/profiles/" + profileId + "/avatar").toPromise();
	}
	
	getProfileBudget(profileId,year){
		return this.http.get("/api/profiles/" + profileId + "/budgets/" + year).toPromise().then(response => response.json());
	}
	saveProfileBudget(profileId,year,data:FormData){
		return this.http.put("/api/profiles/" + profileId + "/budgets/" + year,data).toPromise().then(response => response.json());
	}
	deleteProfileBudget(profileId,year){
		return this.http.delete("/api/profiles/" + profileId + "/budgets/" + year).toPromise();
	}
	
	getProfileBudgets(profileId,options?){
		return this.http.get("/api/profiles/" + profileId + "/budgets" + toParams(options)).toPromise().then(response => response.json());
	}
	
	getProfileContracts(profileId,options?){
		return this.http.get("/api/profiles/" + profileId + "/contracts" + toParams(options)).toPromise().then(response => response.json());
	}
	
	getProfileDashboardDashboard(profileId){
		return this.http.get("/api/profiles/" + profileId + "/dashboard").toPromise().then(response => response.json());
	}

	getProfileEvents(profileId,options?){
		return this.http.get("/api/profiles/" + profileId + "/events" + toParams(options)).toPromise().then(response => response.json());
	}
	
	getProfilePayments(profileId,options?){
		return this.http.get("/api/profiles/" + profileId + "/payments" + toParams(options)).toPromise().then(response => response.json());
	}
	getProfilePaymentsMonths(profileId){
		return this.http.get("/api/profiles/" + profileId + "/payments/months").toPromise().then(response => response.json());
	}
	
	getProfileManagers(profileId){
		return this.http.get("/api/profiles/" + profileId + "/managers").toPromise().then(response => response.json());
	}
	
	getProfileNoticeBoard(profileId,options?){
		return this.http.get("/api/profiles/" + profileId + "/noticeboard" + toParams(options)).toPromise().then(response => response.json());
	}
	


	/* EVENTS */
	getEvent(eventId){
		return this.http.get("/api/events/" + eventId).toPromise().then(response => response.json());
	}
	
	getEvents(options?){
		return this.http.get("/api/events" + toParams(options)).toPromise().then(response => response.json());
	}
	
	

	
	
	
	/* USERS */	
	getUsers(){
		return this.http.get("/api/users").toPromise().then(response => response.json());
	}
	
	getUser(userId){
		return this.http.get("/api/users/" + userId).toPromise().then(response => response.json());
	}
	
	saveUser(userData){
		return this.http.post("/api/users/" + userData._id,userData).toPromise().then(response => response.json());
	}
	
	deleteUser(userId){
		return this.http.delete("/api/users/" + userId).toPromise();
	}
	
	/* ETLs */
	getETLs(options?){
		return this.http.get("/api/etl" + toParams(options)).toPromise().then(response => response.json());	
	}
	
	getLatestETLs(profileId,options?){
		return this.http.get("/api/etl/latest/" + profileId + toParams(options)).toPromise().then(response => response.json());	
	}
	
}