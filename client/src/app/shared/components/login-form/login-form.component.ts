import { Component, Output, EventEmitter } from '@angular/core';


import { ToastService } 		from 'app/services/toast.service';
import { AuthService } 		from 'app/services/auth.service';

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

	wrongPassword:boolean = false;

	constructor(public authService: AuthService, private toastService:ToastService) { }

	authenticate(form){
		this.wrongPassword = false;
		
		let loginData = form.value;
		
		this.authService.login(loginData)
			.then(user => {
				this.login.emit(user);			
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