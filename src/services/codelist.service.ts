import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Codelist } from "../shared/schema/codelist";

@Injectable()
export class CodelistService {

	codelists:{ [key: string]: Promise<Codelist> } = {};
	
	constructor(private http: HttpClient) { }
	
	getCodelist(id:string):Promise<Codelist>{

		if(!this.codelists[id]){
			this.codelists[id] = this.http.get<Codelist>("/api/codelists/" + id).toPromise().then(codelist => new Codelist(codelist));
		}
		
		return this.codelists[id];

	}
	
	getName(codelist:string,id:string,date:Date):Promise<string>{
		return this.getCodelist(codelist).then(codelist => codelist ? codelist.getName(id,date) : id)
	}

}