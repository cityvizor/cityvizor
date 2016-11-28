import { Component } from '@angular/core';

import { DataService } from './services/data.service';
import { ToastService } 		from './services/toast.service';
import { UserService, User } 		from './services/user.service';

@Component({
	moduleId: module.id,
	selector: 'supervizor-plus',
	templateUrl: 'app.template.html',
	styleUrls: ['app.style.css']
})
export class AppComponent {

	toasts: Array<any>;

	year: string;

	openLogin:boolean = false;

	loginData = {
		login:"",
		password:""
	};

	user: User;	

	constructor(private _toastService: ToastService, private _userService: UserService) {
		var today = new Date();
		this.year = today.getFullYear() == 2016 ? "2016" : "2016 ~ " + today.getFullYear();

		this.toasts = this._toastService.toasts;
		
		this.user = this._userService.user;
	}

	login(){
		this._userService.login(this.loginData);
	}

}