import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';

import { ACL_Admin } from "../acl/admin";
import { ACL_Guest } from "../acl/guest";
import { ACL_ProfileManager } from "../acl/profile-manager";

import { User } from "../shared/schema/user";

export { User };
/**
	* Service to save user information and commnicate user data with server
	*/
@Injectable()
export class UserService {
	
	jwtHelper: JwtHelper = new JwtHelper();

 	// all ACL roles and their definitions
	roles = {
		"admin": ACL_Admin,
		"guest": ACL_Guest,
		"profile-manager": ACL_ProfileManager
	};

 	// current user roles
	userRoles:any[] = [];
	
	// boolean if user is logged
	logged: boolean = false;

	// current user (use blank user as default)
	user: User = new User;
	
 	// current token
	token: String = null;

 
	constructor(private http: Http){
		// refresh user data to match token
		this.refreshState();
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
		
		// query the web api to get the token
		return this.http.post("/api/login", credentials).toPromise()
			
			.then(response => response.text())
			
			.then(token => {
				
				// check if the token is valid
				if(!this.jwtHelper.isTokenExpired(token)){
					
					//save the token to storage
					this.saveToken(token);
					
					// update user data to match token
					this.refreshState();
					
					// send the user object to next .then() 
					return this.user;
				}
				
				// missing or invalid token, don't send anything
				return null;				
			});
	}

	/*
	 * lookup token in storage and check if it is valid. if yes, save the user
	 */
	refreshState(){
		
		// get token from storage
		var token = this.getToken();
		
		// check if token valid
		if(token && !this.jwtHelper.isTokenExpired(token)){
			this.user = this.jwtHelper.decodeToken(token);
			this.logged = true;
			this.refreshRoles();
			
		}	else {
			// token invalid, so set empty user
			this.user = new User;
			this.logged = false;
			this.refreshRoles();
		}
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
	refreshRoles(){
		
		// empty the current roles array
		this.userRoles = [];
		
		// guest role is by default;
		this.userRoles.push(this.roles.guest); 
		
		// if we have a user with roles, then assign his/her roles
		if(this.logged && this.user && this.user.roles){
			this.user.roles
				.filter(role => this.roles[role]) // filter out invalid roles
				.forEach(role => this.userRoles.push(this.roles[role])); // assign roles to currentRoles array
		}
		
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