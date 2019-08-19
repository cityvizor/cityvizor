import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Codelist, CodelistEntry } from "app/shared/schema/codelist";
import { environment } from 'environments/environment';

@Injectable()
export class CodelistService {

	codelists:{ [key: string]: Promise<Codelist> } = {};
	
	constructor(private http: HttpClient) { }
	
	getCodelist(id:string):Promise<Codelist>{

		if(!this.codelists[id]){
			this.codelists[id] = this.http.get<CodelistEntry[]>(environment.api_root + "/codelists/" + id).toPromise().then(codelist => new Codelist(id, codelist));
		}
		
		return this.codelists[id];

	}
	
	getName(codelist:string,id:string,date:Date):Promise<string>{
		return this.getCodelist(codelist).then(codelist => codelist ? codelist.getName(id,date) : id)
	}

}