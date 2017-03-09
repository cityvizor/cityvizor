import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';


/**
	* User object to save data concerning current (or other) user
	*/
export class User {

	/** 
		* user's indentification 
		*/
	public login: string;

	/**
		* list of all the entities user has rights to manage
		*/
	public managedProfiles: Array<string> = [];
	
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
	
	jwtHelper: JwtHelper = new JwtHelper();

	logged: boolean = false;
	
	/**
		* current user
		*/
	user: User = new User;

	token: String = null;

	constructor(private http: Http){
		this.refreshState();
	}

	saveToken(token){
		window.localStorage.setItem("id_token", token);
		this.refreshState();
	}

	getToken(){
		return window.localStorage.getItem("id_token");	
	}

	deleteToken(){
		window.localStorage.removeItem("id_token");
		this.refreshState();
	}

	refreshState(){
		var token = this.getToken();
		
		if(token && !this.jwtHelper.isTokenExpired(token)){
			this.user = this.jwtHelper.decodeToken(token);
			this.logged = true;
		}	else {
			this.user = new User;
			this.logged = false;
		}
	}

	login(data){
		return this.http.post("/api/login", data).toPromise()
			.then(response => response.text())
			.then(token => {
				if(!this.jwtHelper.isTokenExpired(token)){
					this.saveToken(token);
					return this.user;
				}
				return null;				
			});
	}

	logout(){
		this.deleteToken();
	}

	isManagedProfile(profileId){
		return (this.user && this.user.managedProfiles.indexOf(profileId) >= 0);
	}
}