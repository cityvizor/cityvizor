import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';

import { ACL_Admin } from "../acl/admin";
import { ACL_Guest } from "../acl/guest";
import { ACL_ProfileManager } from "../acl/profile-manager";
import { ACL_ProfileAdmin } from "../acl/profile-admin";

import { User } from "../shared/schema/user";

import { DataService } 		from './data.service';

/**
	* Service to save user information and commnicate user data with server
	*/
@Injectable()
export class AuthService {
	
	jwtHelper: JwtHelper = new JwtHelper();

 	// all ACL roles and their definitions
	roles = {
		"admin": ACL_Admin,
		"guest": ACL_Guest,
		"profile-manager": ACL_ProfileManager,
		"profile-admin": ACL_ProfileAdmin
	};

	// boolean if user is logged
	logged: boolean = false;

 	// current token
	token: String = null;

	// current user (use blank user as default)
	user: User = new User;

 	// current user roles
	userRoles:any[] = [];
	
 
	constructor(private http: Http){
		// refresh user data to match token
		this.refreshState()
		// periodically check token validity
		setInterval(() => this.refreshState(), 60000);
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
	login(credentials){
		
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
					if(this.logged) resolve(this.user)
					else reject(new Error("Invalid token"));
				
				})
				.catch(err => reject(err));
			
		});
	}

	/*
	 * lookup token in storage and check if it is valid. if yes, update state
	 */
	refreshState(){
		
		// get token from storage
		var token = this.getToken();
		
		// check if token valid
		if(token && !this.jwtHelper.isTokenExpired(token)){
			
			this.token = token;
			
			this.user = this.jwtHelper.decodeToken(token);
			
			this.setRoles(this.user.roles);
			
			this.logged = true;
			
		}	else {
			// token invalid, so set empty user
			this.token = null;
			this.logged = false;	
			this.setRoles(null);
			this.user = new User;
		}
		
		return this.logged;
	}

	/*
	 * log out user 
	 */
	logout(){
		
		// delete token from storage
		this.deleteToken();
		
		// update user data
		this.refreshState();
	}

	/* 
	 * update this.userRoles to match current user roles
	 */
	setRoles(roles){
		
		// empty the current roles array
		let userRoles = [];
		
		// guest role is by default;
		userRoles.push(this.roles.guest); 
		
		if(roles){
			roles
				.filter(role => !!this.roles[role]) // filter out invalid roles
				.forEach(role => userRoles.push(this.roles[role])); // assign roles to currentRoles array
		}
		
		this.userRoles = userRoles;
	}

	// function to evaluate single permission
	evalPermission(permission,params?){

		// if permission is a function, then evaluate its return value
		if(typeof permission == 'function') return (permission(this.user,params) === true);

		// if permission is boolean true, then evaluate the value
		else if (permission === true) return true;

		// if permission unspecified or misspecified, return false
		else return false;
	}

	// function to get user roles and evaluate permissions
	acl(resource,params?){
								 
		console.log(resource,params,this.userRoles);

		// go through all roles and check if some has permission, otherwise return false
		return this.userRoles.some(role => {

			// in case we have set permission for resource and action
			//if(role[resource] && role[resource][operation]) return this.evalPermission(role[resource][operation],params);

			// in case we have set permission for resource and default action
			//else if(role[resource] && role[resource]["*"]) return this.evalPermission(role[resource]["*"],params);

			// in case we have set permission for resource
			if(role[resource]) return this.evalPermission(role[resource],params);
								 
			// in case we have set default permission
			else if(role["*"]) return this.evalPermission(role["*"],params);

			// if nothing is set, user does not have permission
			else return false;
		});
	}


}