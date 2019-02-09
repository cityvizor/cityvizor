import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Paginator } from 'app/shared/schema/paginator';
import { ETL } from "app/shared/schema/etl";
import { Counterparty } from "app/shared/schema/counterparty";
import { Dashboard } from "app/shared/schema/dashboard";

import { environment } from "environments/environment";

function toParams(options) {
	if (!options) return "";

	var params = Object.keys(options)
		.map(key => {
			if (typeof options[key] === "object") return Object.keys(options[key]).map(key2 => key + "[" + key2 + "]=" + options[key][key2]).join("&");
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

	root = environment.api_root;

	constructor(private http: HttpClient) { }


	/* PROFILES */
	getProfiles(options?) {
		return this.http.get<any>(this.root + "/profiles" + toParams(options)).toPromise();
	}

	getProfile(profileId) {
		return this.http.get<any>(this.root + "/profiles/" + profileId).toPromise();
	}

	createProfile(profile) {
		return this.http.post<any>(this.root + "/profiles", profile).toPromise();
	}

	saveProfile(profile) {
		return this.http.put<any>(this.root + "/profiles/" + profile._id, profile).toPromise();
	}

	/* AVATARS */
	saveProfileAvatar(profileId, data: FormData) {
		return this.http.put(this.root + "/profiles/" + profileId + "/avatar", data, { responseType: 'text' }).toPromise();
	}
	deleteProfileAvatar(profileId) {
		return this.http.delete(this.root + "/profiles/" + profileId + "/avatar", { responseType: 'text' }).toPromise();
	}

	/* BUDGETS */
	getProfileBudget(profileId, year) {
		return this.http.get<any>(this.root + "/profiles/" + profileId + "/budgets/" + year).toPromise();
	}
	getProfileBudgets(profileId, options?) {
		return this.http.get<any[]>(this.root + "/profiles/" + profileId + "/budgets" + toParams(options)).toPromise();
	}

	/* CONTRACTS */
	getProfileContracts(profileId, options?) {
		return this.http.get<any>(this.root + "/profiles/" + profileId + "/contracts" + toParams(options)).toPromise();
	}

	/* DASHBOARD */
	getProfileDashboard(profileId: string) {
		return this.http.get<any>(this.root + "/profiles/" + profileId + "/dashboard").toPromise();
	}

	/* ETL */
	getProfileETLs(profileId, options?) {
		return this.http.get<any[]>(this.root + "/profiles/" + profileId + "/etls" + toParams(options)).toPromise();
	}
	getProfileETLLogs(profileId, etlId, options?) {
		if (typeof etlId === "string") return this.http.get<Paginator>(this.root + "/profiles/" + profileId + "/etls/" + etlId + "/logs" + toParams(options)).toPromise();
		else return this.http.get<Paginator>(this.root + "/profiles/" + profileId + "/etllogs" + toParams(etlId || options)).toPromise();
	}
	getProfileETL(profileId, etlId, options?) {
		return this.http.get<any>(this.root + "/profiles/" + profileId + "/etls/" + etlId + toParams(options)).toPromise();
	}
	createProfileETL(profileId, data) {
		return this.http.post<ETL>(this.root + "/profiles/" + profileId + "/etls/", data).toPromise();
	}
	saveProfileETL(profileId, etlId, data) {
		return this.http.put<any>(this.root + "/profiles/" + profileId + "/etls/" + etlId, data).toPromise();
	}
	deleteProfileETL(profileId, etlId, options?) {
		return this.http.delete(this.root + "/profiles/" + profileId + "/etls/" + etlId + toParams(options), { responseType: 'text' }).toPromise();
	}

	/* EVENTS */
	getProfileEvents(profileId, options?) {
		return this.http.get<any[]>(this.root + "/profiles/" + profileId + "/events" + toParams(options)).toPromise();
	}

	/* PAYMENTS */
	getProfilePayments(profileId, options?) {
		return this.http.get<any>(this.root + "/profiles/" + profileId + "/payments" + toParams(options)).toPromise();
	}
	getProfilePaymentsMonths(profileId) {
		return this.http.get<any[]>(this.root + "/profiles/" + profileId + "/payments/months").toPromise();
	}

	/* MANAGERS */
	getProfileManagers(profileId) {
		return this.http.get<any[]>(this.root + "/profiles/" + profileId + "/managers").toPromise();
	}

	/* NOTICE BOARD */
	getProfileNoticeBoard(profileId, options?) {
		return this.http.get<any[]>(this.root + "/profiles/" + profileId + "/noticeboard" + toParams(options)).toPromise();
	}

	/* IMPORT DATA */
	uploadProfileImport(profileId, etlId, data: FormData) {
		return this.http.put(this.root + "/profiles/" + profileId + "/import/" + etlId + "/upload", data, { responseType: 'text' }).toPromise();
	}
	startProfileImport(profileId, etlId) {
		return this.http.get(this.root + "/profiles/" + profileId + "/import/" + etlId + "/start", { responseType: 'text' }).toPromise();
	}

	/* EVENTS */
	getEvent(eventId) {
		return this.http.get<any>(this.root + "/events/" + eventId).toPromise();
	}

	getCounterparty(conterpartyId: string) {
		return this.http.get<Counterparty>(this.root + "/counterparties/" + conterpartyId).toPromise();
	}

	getCounterparties(options?: any) {
		return this.http.get<any[]>(this.root + "/counterparties" + toParams(options)).toPromise();
	}

	getCounterpartiesTop(){
		return this.http.get<Counterparty[]>(this.root + "/counterparties/top").toPromise();
	}

	searchCounterparties(query: string) {
		return this.http.get<any[]>(this.root + "/counterparties/search" + toParams({ query: query })).toPromise();
	}

	getCounterpartyBudgets(counterpartyId:string){
		return this.http.get<any[]>(this.root + "/counterparties/" + counterpartyId + "/budgets").toPromise();
	}

	getCounterpartyPayments(counterpartyId:string){
		return this.http.get<any[]>(this.root + "/counterparties/" + counterpartyId + "/payments").toPromise();
	}

	/* USERS */
	getUsers() {
		return this.http.get<any>(this.root + "/users").toPromise();
	}
	getUser(userId) {
		return this.http.get<any>(this.root + "/users/" + userId).toPromise();
	}
	saveUser(userData) {
		return this.http.post<any>(this.root + "/users/" + userData._id, userData).toPromise();
	}
	deleteUser(userId) {
		return this.http.delete(this.root + "/users/" + userId, { responseType: 'text' }).toPromise();
	}
}