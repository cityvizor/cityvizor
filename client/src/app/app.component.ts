import { Component, ViewContainerRef, ViewChild, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';

import { ToastService } from './services/toast.service';
import { AuthService } from './services/auth.service';
import { ACLService } from './services/acl.service';

import { AppConfig, IAppConfig } from 'config/config';

import * as packageJSON from "../../package.json";

class LoginData {
	login: string = "";
	password: string = "";
}

@Component({
	selector: 'cityvizor-app',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
	animations: [
		trigger("toastsFadeOut", [
			transition(':leave', animate(250, style({ opacity: 0 }))) // * => void
		])
	]
})
export class AppComponent {

	private viewContainerRef: ViewContainerRef; // ng2-bootstrap requirement

	// get the login modal so that we can close the login modal on succesful login
	@ViewChild('loginModal', { static: false })
	public loginModal;

	// array to link toasts from toastService
	toasts: Array<any>;

	version = packageJSON.version;

	wrongPassword: boolean = false;

	constructor(private toastService: ToastService, public authService: AuthService, public aclService: ACLService, private router: Router, @Inject(AppConfig) public config: IAppConfig) {
		this.toasts = this.toastService.toasts;
	}

	logout() {
		this.router.navigate(['/']);
		this.authService.logout();
	}

}