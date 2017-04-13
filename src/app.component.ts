import { Component, ViewContainerRef, ViewChild } from '@angular/core';

// SVATKY, TODO: SMAZAT :)
import { Http } from "@angular/http";
import { Observable } from 'rxjs/Observable';

import { DataService } from './services/data.service';
import { ToastService } 		from './services/toast.service';
import { UserService, User } 		from './services/user.service';

class LoginData {
	login:string = "";
	password:string = "";
}

@Component({
	moduleId: module.id,
	selector: 'cityvizor-app',
	templateUrl: 'app.template.html',
	styleUrls: ['app.style.css']
})
export class AppComponent {

	private viewContainerRef: ViewContainerRef; // ng2-bootstrap requirement

	@ViewChild('loginModal')
	public loginModal;

	toasts: Array<any>;

	year: string;

	loginData:LoginData = new LoginData;

	wrongPassword:boolean = false;

	// SVATKY, TODO: SMAZAT :)
	nameday:string;

	constructor(private toastService: ToastService, public userService: UserService, viewContainerRef:ViewContainerRef, http:Http) {
		var today = new Date();
		this.year = today.getFullYear() == 2016 ? "2016" : "2016&nbsp;~&nbsp;" + today.getFullYear();

		this.toasts = this.toastService.toasts;
		
		// SVATKY, TODO: SMAZAT :)
		http.get("http://svatky.adresa.info/json").toPromise().then(response => response.json()).then(nameday => this.nameday = nameday[0].name);
	}

	login(){
		this.wrongPassword = false;
		
		this.userService.login(this.loginData)
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
		this.userService.logout();
	}

}