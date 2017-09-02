import { Component, ViewContainerRef, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { DataService } from './services/data.service';
import { ToastService } 		from './services/toast.service';
import { AuthService } 		from './services/auth.service';
import { User } from './shared/schema/user';

import { AppConfig } from './config/config';

class LoginData {
	login:string = "";
	password:string = "";
}

@Component({
	moduleId: module.id,
	selector: 'cityvizor-app',
	templateUrl: 'app.template.html',
	styleUrls: ['app.style.css'],
	animations: [
		trigger("toastsFadeOut", [
			transition(':leave', animate(250, style({opacity: 0}))) // * => void
		])
	]
})
export class AppComponent {

	private viewContainerRef: ViewContainerRef; // ng2-bootstrap requirement

	@ViewChild('loginModal')
	public loginModal;

	toasts: Array<any>;

	year: string;

	loginData:LoginData = new LoginData;

	wrongPassword:boolean = false;

	config:any = AppConfig;

	constructor(private toastService: ToastService, public authService: AuthService, viewContainerRef:ViewContainerRef) {
		var today = new Date();
		this.year = today.getFullYear() == 2016 ? "2016" : "2016&nbsp;~&nbsp;" + today.getFullYear();

		this.toasts = this.toastService.toasts;
	}

	login(){
		this.wrongPassword = false;
		
		this.authService.login(this.loginData)
			.then(user => {
				this.closeLogin();				
			})
			.catch(err => {
				if(err.status === 401){
					this.wrongPassword = true;
				}
				else {
					this.closeLogin();
					this.toastService.toast("Neznámá chyba při přihlášení, prosím kontaktujte správce.","error");
				}
			});
	}

	closeLogin(){
		this.loginModal.hide();
		this.wrongPassword = false;
		this.loginData = new LoginData;
	}

	logout(){
		this.authService.logout();
	}

}