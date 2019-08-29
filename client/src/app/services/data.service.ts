import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ETL } from "app/schema/etl";
import { Counterparty } from "app/schema/counterparty";
import { Dashboard, DashboardRow } from "app/schema/dashboard";

import { environment } from "environments/environment";
import { BudgetEvent, BudgetGroupEvent, BudgetTypedAmounts, Budget, Profile } from 'app/schema';

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
@Injectable({
	providedIn: 'root'
})
export class DataService {

	root = environment.api_root;

	constructor(private http: HttpClient) { }


	/* PROFILES */
	getProfiles(options?) {
		return this.http.get<Profile[]>(this.root + "/profiles" + toParams(options)).toPromise();
	}

	getProfile(profileId: number | string) {
		return this.http.get<Profile>(this.root + "/profiles/" + profileId).toPromise();
	}

	getMainProfile() {
		return this.http.get<Profile>(this.root + "/profiles/main").toPromise();
	}

	async createProfile(profile) {
		const response = await this.http.post(this.root + "/profiles", profile, { observe: "response", responseType: "text" }).toPromise();
		return this.http.get<any>(this.root + response.headers.get("location")).toPromise();
	}

	saveProfile(profile) {
		return this.http.patch<any>(this.root + "/profiles/" + profile.id, profile).toPromise();
	}

	deleteProfile(profileId: number) {
		return this.http.delete<any>(this.root + "/profiles/" + profileId).toPromise();
	}

	/* AVATARS */
	saveProfileAvatar(profileId: number, data: FormData) {
		return this.http.put(this.root + "/profiles/" + profileId + "/avatar", data, { responseType: 'text' }).toPromise();
	}
	deleteProfileAvatar(profileId: number) {
		return this.http.delete(this.root + "/profiles/" + profileId + "/avatar", { responseType: 'text' }).toPromise();
	}

	getProfileAccounting(profileId: number, year: number) {
		return this.http.get<any>(this.root + "/profiles/" + profileId + "/accounting/" + year).toPromise();
	}
	getProfileAccountingGroups(profileId: number, year: number, field: string) {
		return this.http.get<any>(this.root + "/profiles/" + profileId + "/accounting/" + year + "/groups/" + field).toPromise();
	}
	getProfileAccountingEvents(profileId: number, year: number, field: string, groupId: string) {
		return this.http.get<Array<Pick<BudgetGroupEvent, "id" | "name" | "items"> & BudgetTypedAmounts>>(this.root + "/profiles/" + profileId + "/accounting/" + year + "/groups/" + field + "/" + groupId + "/events").toPromise();
	}
	getProfileAccountingPayments(profileId, year, options?) {
		return this.http.get<any>(this.root + "/profiles/" + profileId + "/accounting/" + year + "/payments", { params: options }).toPromise();
	}

	/* YEARS */
	getProfileBudget(profileId: number, year) {
		return this.http.get<Budget>(this.root + "/profiles/" + profileId + "/years/" + year).toPromise();
	}
	getProfileBudgets(profileId: number, options?) {
		return this.http.get<Budget[]>(this.root + "/profiles/" + profileId + "/years" + toParams(options)).toPromise();
	}

	/* CONTRACTS */
	getProfileContracts(profileId: number, options?) {
		return this.http.get<any>(this.root + "/profiles/" + profileId + "/contracts" + toParams(options)).toPromise();
	}

	/* DASHBOARD */
	getProfileDashboard(profileId: number) {
		return this.http.get<DashboardRow[]>(this.root + "/profiles/" + profileId + "/dashboard").toPromise();
	}

	/* ETL */
	getProfileETLs(profileId: number, options?) {
		return this.http.get<any[]>(this.root + "/profiles/" + profileId + "/etls" + toParams(options)).toPromise();
	}
	getProfileETLLogs(profileId, etlId, options?) {
		if (typeof etlId === "string") return this.http.get<any>(this.root + "/profiles/" + profileId + "/etls/" + etlId + "/logs" + toParams(options)).toPromise();
		else return this.http.get<any>(this.root + "/profiles/" + profileId + "/etllogs" + toParams(etlId || options)).toPromise();
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
	getProfileEvents(profileId: number, year: number, options?) {
		return this.http.get<BudgetEvent[]>(this.root + "/profiles/" + profileId + "/events/" + year + toParams(options)).toPromise();
	}
	getProfileEvent(profileId: string, eventId: number, year: number) {
		return this.http.get<BudgetEvent>(this.root + "/profiles/" + profileId + "/events/" + year + "/" + eventId).toPromise();
	}
	getProfileEventHistory(profileId: string, eventId: number) {
		return this.http.get<BudgetEvent[]>(this.root + "/profiles/" + profileId + "/events/history/" + eventId).toPromise();
	}

	/* PAYMENTS */
	getProfilePayments(profileId: number, options?) {
		return this.http.get<any>(this.root + "/profiles/" + profileId + "/payments" + toParams(options)).toPromise();
	}
	getProfilePaymentsMonths(profileId) {
		return this.http.get<{ month: number, year: number }[]>(this.root + "/profiles/" + profileId + "/payments/months").toPromise();
	}

	/* MANAGERS */
	getProfileManagers(profileId: number) {
		return this.http.get<any[]>(this.root + "/profiles/" + profileId + "/managers").toPromise();
	}

	/* NOTICE BOARD */
	getProfileNoticeBoard(profileId: number, options?) {
		return this.http.get<any[]>(this.root + "/profiles/" + profileId + "/noticeboard" + toParams(options)).toPromise();
	}

	/* IMPORT DATA */
	uploadProfileImport(profileId: number, etlId, data: FormData) {
		return this.http.put(this.root + "/profiles/" + profileId + "/import/" + etlId + "/upload", data, { responseType: 'text' }).toPromise();
	}
	startProfileImport(profileId: number, etlId) {
		return this.http.get(this.root + "/profiles/" + profileId + "/import/" + etlId + "/start", { responseType: 'text' }).toPromise();
	}

	/* EVENTS */
	getEvent(eventId: number) {
		return this.http.get<any>(this.root + "/events/" + eventId).toPromise();
	}

	getCounterparty(conterpartyId: string) {
		return this.http.get<Counterparty>(this.root + "/counterparties/" + conterpartyId).toPromise();
	}

	getCounterparties(options?: any) {
		return this.http.get<any[]>(this.root + "/counterparties" + toParams(options)).toPromise();
	}

	getCounterpartiesTop() {
		return this.http.get<Counterparty[]>(this.root + "/counterparties/top").toPromise();
	}

	searchCounterparties(query: string) {
		return this.http.get<any[]>(this.root + "/counterparties/search" + toParams({ query: query })).toPromise();
	}

	getCounterpartyBudgets(counterpartyId: string) {
		return this.http.get<any[]>(this.root + "/counterparties/" + counterpartyId + "/budgets").toPromise();
	}

	getCounterpartyPayments(counterpartyId: string) {
		return this.http.get<any[]>(this.root + "/counterparties/" + counterpartyId + "/payments").toPromise();
	}

	/* USERS */
	getUsers() {
		return this.http.get<any>(this.root + "/users").toPromise();
	}
	getUser(userId) {
		return this.http.get<any>(this.root + "/users/" + userId).toPromise();
	}
	async createUser(userData) {
		const response = await this.http.post(this.root + "/users", userData, { observe: "response", responseType: "text" }).toPromise();
		return this.http.get<any>(this.root + response.headers.get("location")).toPromise();
	}
	saveUser(userData) {
		return this.http.patch<any>(this.root + "/users/" + userData.id, userData).toPromise();
	}
	deleteUser(userId) {
		return this.http.delete(this.root + "/users/" + userId, { responseType: 'text' }).toPromise();
	}
}