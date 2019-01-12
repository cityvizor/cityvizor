import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Codelist } from "app/shared/schema/codelist";
import { environment } from 'environments/environment.local';

@Injectable()
export class CodelistService {

	codelists:{ [key: string]: Promise<Codelist> } = {};
	
	constructor(private http: HttpClient) { }
	
	getCodelist(id:string):Promise<Codelist>{

		if(!this.codelists[id]){
			this.codelists[id] = this.http.get<Codelist>(environment.api_root + "/codelists/" + id).toPromise().then(codelist => new Codelist(codelist));
		}
		
		return this.codelists[id];

	}
	
	getName(codelist:string,id:string,date:Date):Promise<string>{
		return this.getCodelist(codelist).then(codelist => codelist ? codelist.getName(id,date) : id)
	}

}