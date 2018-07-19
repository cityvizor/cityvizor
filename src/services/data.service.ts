import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Paginator } from '../shared/schema/paginator';
import { ETL } from "../shared/schema/etl";
import { Counterparty } from "../shared/schema/counterparty";
import { Dashboard } from "../shared/schema/dashboard";

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
	
	/* AVATARS */
	saveProfileAvatar(profileId,data:FormData){
		return this.http.put("/api/profiles/" + profileId + "/avatar",data, { responseType: 'text' }).toPromise();
	}
	deleteProfileAvatar(profileId){
		return this.http.delete("/api/profiles/" + profileId + "/avatar", { responseType: 'text' }).toPromise();
	}
	
	/* BUDGETS */
	getProfileBudget(profileId,year){
		return this.http.get<any>("/api/profiles/" + profileId + "/budgets/" + year).toPromise();
	}
	getProfileBudgets(profileId,options?){
		return this.http.get<any[]>("/api/profiles/" + profileId + "/budgets" + toParams(options)).toPromise();
	}
	
	/* CONTRACTS */
	getProfileContracts(profileId,options?){
		return this.http.get<any>("/api/profiles/" + profileId + "/contracts" + toParams(options)).toPromise();
	}
	
	/* DASHBOARD */
	getProfileDashboard(profileId:string){
		return this.http.get<Dashboard>("/api/profiles/" + profileId + "/dashboard").toPromise();
	}
	
	/* ETL */
	getProfileETLs(profileId,options?){
		return this.http.get<any[]>("/api/profiles/" + profileId + "/etls" + toParams(options)).toPromise();
	}
	getProfileETLLogs(profileId,etlId,options?){
		if(typeof etlId === "string") return this.http.get<Paginator>("/api/profiles/" + profileId + "/etls/" + etlId + "/logs" + toParams(options)).toPromise();
		else return this.http.get<Paginator>("/api/profiles/" + profileId + "/etllogs" + toParams(etlId || options)).toPromise();
	}
	getProfileETL(profileId,etlId,options?){
		return this.http.get<any>("/api/profiles/" + profileId + "/etls/" + etlId + toParams(options)).toPromise();
	}
	createProfileETL(profileId,data){
		return this.http.post<ETL>("/api/profiles/" + profileId + "/etls/", data).toPromise();
	}
	saveProfileETL(profileId,etlId,data){
		return this.http.put<any>("/api/profiles/" + profileId + "/etls/" + etlId,data).toPromise();
	}
	deleteProfileETL(profileId,etlId,options?){
		return this.http.delete("/api/profiles/" + profileId + "/etls/" + etlId + toParams(options), { responseType: 'text' }).toPromise();
	}

	/* EVENTS */
	getProfileEvents(profileId,options?){
		return this.http.get<any[]>("/api/profiles/" + profileId + "/events" + toParams(options)).toPromise();
	}
	
	/* PAYMENTS */
	getProfilePayments(profileId,options?){
		return this.http.get<any>("/api/profiles/" + profileId + "/payments" + toParams(options)).toPromise();
	}
	getProfilePaymentsMonths(profileId){
		return this.http.get<any[]>("/api/profiles/" + profileId + "/payments/months").toPromise();
	}
	
	/* MANAGERS */
	getProfileManagers(profileId){
		return this.http.get<any[]>("/api/profiles/" + profileId + "/managers").toPromise();
	}
	
	/* NOTICE BOARD */
	getProfileNoticeBoard(profileId,options?){
		return this.http.get<any[]>("/api/profiles/" + profileId + "/noticeboard" + toParams(options)).toPromise();
	}
	
	/* IMPORT DATA */
	uploadProfileImport(profileId,etlId,data:FormData){
		return this.http.put("/api/profiles/" + profileId + "/import/" + etlId + "/upload",data, { responseType: 'text' }).toPromise();
	}
	startProfileImport(profileId,etlId){
		return this.http.get("/api/profiles/" + profileId + "/import/" + etlId + "/start", { responseType: 'text' }).toPromise();
	}

	/* EVENTS */
	getEvent(eventId){
		return this.http.get<any>("/api/events/" + eventId).toPromise();
	}
  
  getCounterparty(conterpartyId:string){
		return this.http.get<Counterparty>("/api/counterparties/" + conterpartyId).toPromise();
	}
  
  getCounterparties(options?:any){
		return this.http.get<any[]>("/api/counterparties" + toParams(options)).toPromise();
	}
  
  searchCounterparties(query:string){
		return this.http.get<any[]>("/api/counterparties/search" + toParams({query:query})).toPromise();
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
		return this.http.delete("/api/users/" + userId, { responseType: 'text' }).toPromise();
	}
	
}