import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

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
	**/
@Injectable()
export class DataService {
	
	constructor(private http: HttpClient) { }
	
	
	/* PROFILES */
	getProfiles(options?) {
			return this.http.get<any>("/api/profiles" + toParams(options)).toPromise();
	}

	getProfile(profileId) {
		return this.http.get<any>("/api/profiles/" + profileId).toPromise();
	}
	
	createProfile(profile){
		return this.http.post<any>("/api/profiles",profile).toPromise();
	}
	
	saveProfile(profile){
		return this.http.put<any>("/api/profiles/" + profile._id,profile).toPromise();
	}
	
	saveProfileAvatar(profileId,data:FormData){
		return this.http.put("/api/profiles/" + profileId + "/avatar",data, { responseType: 'text' }).toPromise();
	}
	deleteProfileAvatar(profileId){
		return this.http.delete("/api/profiles/" + profileId + "/avatar", { responseType: 'text' }).toPromise();
	}
	
	getProfileBudget(profileId,year){
		return this.http.get<any>("/api/profiles/" + profileId + "/budgets/" + year).toPromise();
	}
	saveProfileBudget(profileId,year,data:FormData){
		return this.http.put<any>("/api/profiles/" + profileId + "/budgets/" + year,data).toPromise();
	}
	deleteProfileBudget(profileId,year){
		return this.http.delete("/api/profiles/" + profileId + "/budgets/" + year, { responseType: 'text' }).toPromise();
	}
	
	getProfileBudgets(profileId,options?){
		return this.http.get<any[]>("/api/profiles/" + profileId + "/budgets" + toParams(options)).toPromise();
	}
	
	getProfileContracts(profileId,options?){
		return this.http.get<any>("/api/profiles/" + profileId + "/contracts" + toParams(options)).toPromise();
	}
	
	getProfileDashboardDashboard(profileId){
		return this.http.get<any>("/api/profiles/" + profileId + "/dashboard").toPromise();
	}

	getProfileEvents(profileId,options?){
		return this.http.get<any[]>("/api/profiles/" + profileId + "/events" + toParams(options)).toPromise();
	}
	
	getProfilePayments(profileId,options?){
		return this.http.get<any>("/api/profiles/" + profileId + "/payments" + toParams(options)).toPromise();
	}
	getProfilePaymentsMonths(profileId){
		return this.http.get<any[]>("/api/profiles/" + profileId + "/payments/months").toPromise();
	}
	
	getProfileManagers(profileId){
		return this.http.get<any[]>("/api/profiles/" + profileId + "/managers").toPromise();
	}
	
	getProfileNoticeBoard(profileId,options?){
		return this.http.get<any[]>("/api/profiles/" + profileId + "/noticeboard" + toParams(options)).toPromise();
	}
	


	/* EVENTS */
	getEvent(eventId){
		return this.http.get<any>("/api/events/" + eventId).toPromise();
	}
	
	getEvents(options?){
		return this.http.get<any[]>("/api/events" + toParams(options)).toPromise();
	}
	
	

	
	
	
	/* USERS */	
	getUsers(){
		return this.http.get<any>("/api/users").toPromise();
	}
	
	getUser(userId){
		return this.http.get<any>("/api/users/" + userId).toPromise();
	}
	
	saveUser(userData){
		return this.http.post<any>("/api/users/" + userData._id,userData).toPromise();
	}
	
	deleteUser(userId){
		return this.http.delete("/api/users/" + userId).toPromise();
	}
	
	/* ETLs */
	getETLs(options?){
		return this.http.get<any>("/api/etl" + toParams(options)).toPromise();	
	}
	
	getLatestETLs(profileId,options?){
		return this.http.get<any>("/api/etl/latest/" + profileId + toParams(options)).toPromise();	
	}
	
}