import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Counterparty } from "app/schema/counterparty";
import { DashboardRow } from "app/schema/dashboard";

import { environment } from "environments/environment";
import { BudgetEvent, BudgetGroupEvent, BudgetTypedAmounts, Budget, Profile, Codelist } from 'app/schema';

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

	root = environment.api_root + "/public";
	root_api2 = environment.api2_root 

	constructor(private http: HttpClient) { }

	getCodelist(id: string) {
		return this.http.get<Codelist>(this.root + "/codelists/" + id).toPromise();
	}

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

	/* AVATARS */
	getProfileAvatarUrl(profile: Profile): string | null {
		if (profile.avatarType) return this.root + "/profiles/" + profile.id + "/avatar";
		else return null;
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
	getProfileBudget(profileId: number, year: number) {
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

	getCounterpartiesTop(options?: any) {
		return this.http.get<Counterparty[]>(this.root + "/counterparties/top" + toParams(options)).toPromise();
	}

	searchCounterparties(query: string) {
		return this.http.get<any[]>(this.root + "/counterparties/search" + toParams({ query: query })).toPromise();
	}

	getCounterpartyBudgets(counterpartyId: string) {
		return this.http.get<any[]>(this.root + "/counterparties/" + counterpartyId + "/budgets").toPromise();
	}

	getCounterpartyPayments(counterpartyId: string, options?: any) {
		return this.http.get<any[]>(this.root + "/counterparties/" + counterpartyId + "/payments" + toParams(options)).toPromise();
	}

	searchForCities(ico: string) {
		return this.http.get<any[]>(this.root_api2 + "/service/citysearch" + toParams( { query: ico })).toPromise();
	}

}