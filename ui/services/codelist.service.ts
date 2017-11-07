import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Codelist } from "../shared/schema/codelist";

class CodelistCache{
	[k: string]: Codelist[];
}

@Injectable()
export class CodelistService {
	
	cache:CodelistCache = new CodelistCache();
	
	constructor(private http: Http) { }
	
	
	// alias for getCodelist
	get(name:string,date:Date):Promise<any>{
			return this.getCodelist(name,date);
	}
	
	// main get method
	getCodelist(name:string,date:Date):Promise<any>{
		return new Promise((resolve,reject) => {
			
			let cached = this.getCached(name,date);
											
			// if we have already this codelist, then resolve to the cached value
			if(cached) return resolve(cached);
			
			let dateString = date.toISOString();
			
			// otherwise get the codelist from the server
			this.http.get("/api/codelists/" + name + "?date=" + dateString).toPromise()
				.then(response => resolve(this.saveCached(name,response.json())))
				.catch(err => reject(err));
				
		});
	}
	
	/* Search for codelist. Return if found, otherwise return false. */
	getCached(name:string,date:Date){
		
		// here we save the codelist during search
		var codelist;
		
		// if no codelist of that name return false immediately
		if(!this.cache[name]) return false;
		
		// search until first item found
		var matched = this.cache[name].some(item => {
			
			// check date validity. if correct, assign to codelist variable and stop search by returning true. otherwise return false and continue
			if(item.validFrom <= date && item.validTill >= date){
				codelist = item;
				return true;
			}
			else return false;
			
		});
		
		// if some codelist was matched return the codelist contents (not the metadata parent)
		if(matched) return codelist.codelist;
		return false;
	}
				 
	saveCached(name:string,codelist:Codelist){
		
		// if no list was present, we have to create the array
		if(!this.cache[name]) this.cache[name] = [];
		
		// we simply add the codelist to the array
		this.cache[name].push(codelist);
		
		// return the codelist. the return is so that in future versions when some transformation would be present we have common interface to get the just saved codelist
		return codelist.codelist;
	}

}