import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

export class User {

	public logged: boolean = false;
	public login: string;
	public managedEntities: Array<string>;
	public roles: Array<string>;

}

@Injectable()
export class UserService {

	user: User;

	constructor(private _http:Http){
		this.user = new User;
	}

	login(data){
		console.log(data);
		return this._http.post("/api/login", data).toPromise()
		.then(res => console.log(res));	
		/*.then(response => response.json())
			.then(user => this.user = user)
			.catch(() => this.user = null);*/
	}
}