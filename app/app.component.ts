import { Component, ViewContainerRef } from '@angular/core';

import { DataService } from './services/data.service';
import { ToastService } 		from './services/toast.service';
import { UserService, User } 		from './services/user.service';
import { ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';

@Component({
	moduleId: module.id,
	selector: 'supervizor-plus',
	templateUrl: 'app.template.html',
	styleUrls: ['app.style.css']
})
export class AppComponent {

	private viewContainerRef: ViewContainerRef; //ng2-bootstrap requirement

	toasts: Array<any>;

	year: string;

	openLogin:boolean = false;

	loginData = {
		login:"",
		password:""
	};

	user: User;	

	constructor(private _toastService: ToastService, private _userService: UserService, viewContainerRef:ViewContainerRef, componentsHelper:ComponentsHelper) {
		var today = new Date();
		this.year = today.getFullYear() == 2016 ? "2016" : "2016 ~ " + today.getFullYear();

		this.toasts = this._toastService.toasts;
		
		this.user = this._userService.user;
		
		componentsHelper.setRootViewContainerRef(viewContainerRef); //ng2-bootstrap requirement
	}

	login(){
		this._userService.login(this.loginData);
	}

}