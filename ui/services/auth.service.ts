import { Injectable, EventEmitter } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

import { AuthHttp, JwtHelper } from 'angular2-jwt';

import { User } from "../shared/schema/user";

import { DataService } 		from './data.service';

/**
	* Service to save user information and commnicate user data with server
	*/
@Injectable()
export class AuthService {
	
	jwtHelper: JwtHelper = new JwtHelper();

	public onLogin = new Subject<any>();
  public onLogout = new Subject<void>();

	// boolean if user is logged
	logged: boolean = false;

 	// current token
	token: String = null;

	// current user (use blank user as default)
	user: User = new User;

	constructor(private http: AuthHttp){
		
		// refresh user data to match token
		this.refreshState()
		
		// periodically check token validity; once per minute
		setInterval(() => this.refreshState(), 60 * 1000);
		
		// periodically renew token; once per 30 minutes
		setInterval(() => this.renewToken(), 30 * 60 * 1000)
	}

	saveToken(token){
		return window.localStorage.setItem("id_token", token);
	}

	getToken(){
		return window.localStorage.getItem("id_token");	
	}

	deleteToken(){
		return window.localStorage.removeItem("id_token");
	}

	// get the token by credentials
	login(credentials):Promise<any>{
		
		return new Promise((resolve,reject) => {
			
			// query the web api to get the token
			return this.http.post("/api/login", credentials).toPromise()

				.then(response => response.text())

				.then(token => {
				
					//save the token to storage
					this.saveToken(token);

					// update state to match token from storage
					this.refreshState();

					// if user is not logged at this step, token was invalid
					if(this.logged) resolve(this.user);
					else reject(new Error("Invalid token"));
				
				})
				.catch(err => reject(err));
			
		});
	}

	/**
		* Tokens have limited time validity to avoid misues, however, we do not want user to be "logged out" while working with the application. Therefore we have to renew this token from time to time.
		*/
	renewToken():void{
		
		// if we dont have token, there is nothing to renew
		if(!this.token) return;
		
		// get the new token. as an authorization, we use current token
		this.http.get("/api/login/renew").toPromise()

			.then(response => response.text())

			.then(token => {

				//save the token to storage
				this.saveToken(token);

				// update state to match token from storage
				this.refreshState();

				});			
	}

	/*
	 * lookup token in storage and check if it is valid. if yes, update state
	 */
	refreshState():void{
		
		// get token from storage
		var token = this.getToken();
		
		// check if token valid
		if(token && !this.jwtHelper.isTokenExpired(token)){
			
			// save the token
			this.token = token;
			
			// set user
			this.setUser(this.jwtHelper.decodeToken(token));
			
			// announce login to subscribers if applicable
			if(!this.logged) this.onLogin.next(this.user);
			
			this.logged = true;
			
		}	else {
			
			// announce logout to subscribers if applicable
			if(this.logged) this.onLogout.next();
			
			// token invalid or missing, so set empty token and user
			this.token = null;
			this.logged = false;	
			this.setUser(null);
		}
	}

	/*
	 * log out user 
	 */
	logout():boolean{
		
		// delete token from storage
		this.deleteToken();
		
		// update user data
		this.refreshState();
		
		return !this.logged;
	}
	
	setUser(userData:any){
		
		this.user = userData || new User;
		
		if(!this.user.roles) this.user.roles = [];
		
		this.user.roles.push("guest");
		
		// add role user for logged users
		if(userData) this.user.roles.push("user");
	}

}