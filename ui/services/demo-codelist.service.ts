import { Injectable } from '@angular/core';

import { Codelist } from "../shared/schema/codelist";
import { CodelistCache, CodelistService } from "./codelist.service";

import { paragraphNames } from "../shared/data/paragraph-names.data";
import { itemNames } from "../shared/data/item-names.data";
import { HttpClient } from '@angular/common/http';

/* DEMO SERVICE FOR CODELISTS, SEE ORIGINAL CODELIST SERVICE */

type PublicPart<T> = {[K in keyof T]: T[K]}

@Injectable()
export class DemoCodelistService implements PublicPart<CodelistService> {
	
	cache:CodelistCache = new CodelistCache();

	constructor(private http:HttpClient) {
		this.cache["paragraph-names"] = [{
			_id: null,
			name: "paragraph-names",
			validFrom: new Date(1990,0,1),
			validTill: null,
			codelist: paragraphNames
		}];
		
		this.cache["item-names"] = [{
			_id: null,
			name: "item-names",
			validFrom: new Date(1990,0,1),
			validTill: null,
			codelist: itemNames
		}];
	}
	
	// alias for getCodelist
	get(name:string,date:Date):Promise<any>{
			return this.getCodelist(name,date);
	}
	
	// main get method
	getCodelist(name:string,date:Date):Promise<any>{
		return new Promise((resolve,reject) => resolve(this.getCached(name,date)));
	}
	

	/* Search for codelist. Return if found, otherwise return false. */
	getCached(name:string,date:Date){
		return this.cache[name][0].codelist;
	}
				 
	saveCached(name:string,codelist:Codelist){
		return codelist.codelist;
	}

}