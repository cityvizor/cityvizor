import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DateTime } from "luxon";

import { Codelist, CodelistRow } from "app/schema/codelist";
import { environment } from 'environments/environment';

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

	async getCurrentIndex(codelistName: string, date: Date | DateTime): Promise<{ [id: string]: string }> {
		return this.getCurrentCodelist(codelistName, date)
			.then(codelist => codelist.reduce((acc, cur) => (acc[cur.id] = cur.name, acc), {} as { [id: string]: string }));
	}

	async getCurrentItem(codelistName: string, id: string, date: Date | DateTime): Promise<CodelistRow | null | undefined> {
		const codelist = await this.getCodelist(codelistName);

		if (!codelist) return undefined;

		if (!date) date = DateTime.local();
		if (date instanceof Date) date = DateTime.fromJSDate(date);

		const item = codelist.find(row => row.id === id && (!row.validFromDate || row.validFromDate <= date) && (!row.validTillDate || row.validTillDate >= date));

		return item || null;
	}

	async getCurrentName(codelistName: string, id: string, date: Date | DateTime): Promise<string> {
		const row = await this.getCurrentItem(codelistName, id, date);
		return row ? row.name : "???";
	}

	async loadCodelist(id: string): Promise<Codelist> {

		const codelist = await this.http.get<Codelist>(environment.api_root + "/codelists/" + id).toPromise()

		codelist.forEach(row => {
			row.validFromDate = row.validFrom ? DateTime.fromISO(row.validFrom) : undefined;
			row.validTillDate = row.validTill ? DateTime.fromISO(row.validTill) : undefined;
		});

		return codelist;
	}



}