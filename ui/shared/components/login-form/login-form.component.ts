import { Component, Output, EventEmitter } from '@angular/core';


import { ToastService } 		from '../../../services/toast.service';
import { AuthService } 		from '../../../services/auth.service';

@Component({
	moduleId: module.id,
	selector: 'login-form',
	templateUrl: 'login-form.template.html',
	styleUrls: ['login-form.style.css']
})
export class LoginFormComponent {
  
  @Output()
  login:EventEmitter<any> = new EventEmitter();

  @Output()
  cancel:EventEmitter<any> = new EventEmitter();

	wrongPassword:boolean = false;

	constructor(private authService: AuthService, private toastService:ToastService) { }

	authenticate(form){
		this.wrongPassword = false;
		
		console.log(form);
		
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