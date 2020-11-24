import { Component, Output, EventEmitter } from '@angular/core';
import { ToastService } from 'app/services/toast.service';
import { AuthService } from 'app/services/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	moduleId: module.id,
	selector: 'login-form',
	templateUrl: 'login-form.component.html',
	styleUrls: ['login-form.component.scss']
})
export class LoginFormComponent {
  
	@Output()
	login:EventEmitter<any> = new EventEmitter();

	@Output()
	cancel:EventEmitter<any> = new EventEmitter();

	wrongPassword: boolean = false;

	constructor(public authService: AuthService, private toastService:ToastService, private router: Router) { }

	submit(form: NgForm) {
		this.wrongPassword = false;

		let loginData = form.value;
		
		this.authService.login(loginData)
			.then(user => {
				this.login.emit(user);
				// Trigger the browser password auto-save function
				// The types library for the API is broken atm, hence the ts-ignore annotations
				// https://developer.mozilla.org/en-US/docs/Web/API/PasswordCredential
				// https://golb.hplar.ch/2019/06/credential-management-api.html
				if ((window as any).PasswordCredential) {
					//@ts-ignore
					const c: any = new window.PasswordCredential({
						id: loginData.username,
						password: loginData.password,
						name: loginData.username
					})
					//@ts-ignore
					navigator.credentials.store(c)
				}

				this.router.navigate(["/admin/profily"])

			})
			.catch(err => {
				if(err.status === 401){
					this.wrongPassword = true;
				}
				else {
					this.toastService.toast("Neznámá chyba při přihlášení, prosím kontaktujte správce.","error");
				}
			});

		}
}