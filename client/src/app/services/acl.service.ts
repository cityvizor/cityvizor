import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import {AuthService} from 'app/services/auth.service';
import {ToastService} from 'app/services/toast.service';

import {ConfigService} from "config/config";

/**
 * Service to save user information and commnicate user data with server
 */
@Injectable({
    providedIn: 'root'
})
export class ACLService implements CanActivate {

    routes: any = [];

    constructor(private authService: AuthService, private toastService: ToastService, private router: Router, private configService: ConfigService) {
        this.routes = this.configService.config.acl.routes || [];
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        let result = this.checkRoute(state.url);

        if (!result && this.authService.logged) this.toastService.toast("K této stránce nemáte právo přistupovat. Požádejte administrátora o udělení práv.", "error");
        if (!result && !this.authService.logged) {
            this.toastService.toast("Pro přístup k této stránce musíte být přilášeni. Přihlaste se, prosím.", "error");
            this.router.navigate(["/login"]);
        }

        return result;

    }

    // function to get user role and evaluate permissions
    checkRoute(routeString: string, params?: any): boolean {

        const route = this.findRoute(routeString);
        if (!route) return false;

        if (params) Object.assign(route.params, params);

        const user = this.authService.user;

        if (route.routeDef.allowRoles && user.roles && route.routeDef.allowRoles.some(role => user.roles.indexOf(role) !== -1)) return true;

        if (route.routeDef.allow === true) return true;

        return !!(route.routeDef.allowCheck && route.routeDef.allowCheck(user, route.params));
    }

    findRoute(searchRoute: string): any {

        let route;
        const params = {};

        const result = this.routes.some(routeDef => {

            let paramNamesMatches = routeDef.route.match(/:[^\/]+/g);
            let paramNames = paramNamesMatches ? paramNamesMatches.map(item => item.substr(1)) : [];

            // include subpages
            // /admin => enabled is /admin, /admin/, /admin/* not /administrator
            const routeWithoutSlash = routeDef.route[routeDef.route.length - 1] === '/' ?
                routeDef.route.slice(0, routeDef.route.length - 1) : routeDef.route;
            const routeWithoutParams = routeWithoutSlash.replace(/:[^\/]+/g, "([^\/]+)")
            let search = new RegExp(`^${routeWithoutParams}|${routeWithoutParams}/\.*$`);

            let matches = searchRoute.match(search);

            if (matches) {
                route = routeDef;
                matches.slice(1).forEach((match, i) => params[paramNames[i]] = match);
                return true;
            }

            return false;

        });

        if (result) return {routeDef: route, params: params};

        else if (this.configService.config.acl.default) return {
            routeDef: this.configService.config.acl.default,
            params: {}
        };

        return null;
    }


}