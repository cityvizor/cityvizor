import { Injectable, Inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { User } from "app/schema/user";

import { AuthService } 		from 'app/services/auth.service';
import { ToastService } 		from 'app/services/toast.service';

import { AppConfig, IAppConfig } from "config/config";

/**
	* Service to save user information and commnicate user data with server
	*/
@Injectable({
  providedIn: 'root'
})
export class ACLService implements CanActivate {
	
  routes:any = [];
  
	constructor(private authService: AuthService, private toastService:ToastService, private router:Router, @Inject(AppConfig) private config:IAppConfig){
    this.routes = this.config.acl.routes || [];
	}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    
    let result = this.checkRoute(state.url);
    
    if(!result && this.authService.logged) this.toastService.toast("K této stránce nemáte právo přistupovat. Požádejte administrátora o udělení práv.","error");
    if(!result && !this.authService.logged) this.toastService.toast("Pro přístup k této stránce musíte být přilášeni. Přihlaste se, prosím.","error");
    
		if(!result) this.router.navigate(["/"]);
		
    return result;
    
  }

	// function to get user roles and evaluate permissions
	checkRoute(routeString:string, params?:any):boolean{
    
    var route = this.findRoute(routeString);
    if(!route) return false;
		
		if(params) Object.assign(route.params,params);
    
    var user = this.authService.user;  
		
		if(route.routeDef.allow === true) return true;
    
    if(route.routeDef.allowRoles && user.roles && route.routeDef.allowRoles.some(role => user.roles.indexOf(role) !== -1)) return true;
		
    if(route.routeDef.allowCheck && route.routeDef.allowCheck(user,route.params)) return true;
    
    return false;
	}
  
  findRoute(searchRoute:string):any{
    
    var route;
    var params = {};    
    
    var result = this.routes.some(routeDef => {
      
      let paramNamesMatches = routeDef.route.match(/\:[^\/]+/g);
      let paramNames = paramNamesMatches ? paramNamesMatches.map(item => item.substr(1)) : [];
      
      let search = new RegExp("^" + routeDef.route.replace(/\:[^\/]+/g,"([^\/]+)") + "$");

      let matches = searchRoute.match(search);
      
      if(matches){
        route = routeDef;
        matches.slice(1).forEach((match,i) => params[paramNames[i]] = match);
        return true;
      }
      
      return false;
        
    });
    
    if(result) return { routeDef: route, params: params };
    
    else if(this.config.acl.default) return { routeDef: this.config.acl.default, params: {}};
    
    return null;
  }


}