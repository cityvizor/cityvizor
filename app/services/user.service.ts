import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

/**
	* User object to save data concerning current (or other) user
	*/
export class User {

	/**
		* true if user is logged in
		*/
	public logged: boolean = false;

	/** 
		* user's indentification 
		*/
	public login: string;

	/**
		* list of all the entities user has rights to manage
		*/
	public managedEntities: Array<string>;
	
	/**
		* list of all the roles user has
		*/
	public roles: Array<string>;

}

/**
	* Service to save user information and commnicate user data with server
	*/
@Injectable()
export class UserService {

	/**
		* current user
		*/
	user: User;

	constructor(private _http:Http){
		this.user = new User;
	}

	login(data){
		console.log(data);
		return this._http.post("/api/login", data).toPromise()
			.then(res => {console.log(res);return res;})
			.then(response => response.json())
			.then(user => this.user = user)
			.catch(() => this.user = new User);
	}

	logout(){
		this.user = new User;
	}
}