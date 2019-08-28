import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DateTime } from "luxon";

import { Codelist, CodelistRow } from "app/schema/codelist";
import { environment } from 'environments/environment';
import { RouterLinkWithHref } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class CodelistService {

	codelists: { [key: string]: Promise<Codelist> } = {};

	constructor(private http: HttpClient) { }

	getCodelist(id: string): Promise<Codelist> {

		if (!this.codelists[id]) this.codelists[id] = this.loadCodelist(id);

		return this.codelists[id];

	}

	async getCurrentCodelist(codelistName: string, date: Date | DateTime): Promise<Codelist> {

		const codelist = await this.getCodelist(codelistName);
		if (!codelist) return [];

		if (!date) date = DateTime.local();
		if (date instanceof Date) date = DateTime.fromJSDate(date);

		return codelist.filter(row => (!row.validFromDate || row.validFromDate <= date) && (!row.validTillDate || row.validTillDate >= date));

	}

	async getCurrentItem(codelistName: string, id: string, date: Date | DateTime): Promise<CodelistRow> {
		const codelist = await this.getCodelist(codelistName);

		if (!codelist) return undefined;

		if (!date) date = DateTime.local();
		if (date instanceof Date) date = DateTime.fromJSDate(date);

		return codelist.find(row => row.id === id && (!row.validFromDate || row.validFromDate <= date) && (!row.validTillDate || row.validTillDate >= date));
	}

	async getCurrentName(codelistName: string, id: string, date: Date | DateTime): Promise<string> {
		const row = await this.getCurrentItem(codelistName, id, date);
		return row ? row.name : "???";
	}

	async loadCodelist(id: string): Promise<Codelist> {

		const codelist = await this.http.get<Codelist>(environment.api_root + "/codelists/" + id).toPromise()

		codelist.forEach(row => {
			row.validFromDate = row.validFrom ? DateTime.fromISO(row.validFrom) : null;
			row.validTillDate = row.validTill ? DateTime.fromISO(row.validTill) : null;
		});

		return codelist;
	}



}