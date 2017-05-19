import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AuthService } 		from '../../../services/auth.service';
import { DataService } 		from '../../../services/data.service';
import { ToastService } 		from '../../../services/toast.service';

import { User } from "../../../shared/schema/user";

//00006947
@Component({
	moduleId: module.id,
	selector: 'user-admin-account',
	templateUrl: 'user-admin-account.template.html',
	styleUrls: ['user-admin-account.style.css']
})
export class UserAdminAccountComponent implements OnInit {

 	@ViewChild('userForm') userForm: NgForm;

  @ViewChild('userPassForm') userPassForm: NgForm;

  user:User;

	constructor(private authService:AuthService, private dataService: DataService, private toastService: ToastService) {
	}
   
  ngOnInit(){
    this.loadUser();
  }
	 
  loadUser(){
    this.dataService.getUser(this.authService.user._id)
      .then(user => this.user = user);
  }
   
	saveUser(){
		var userData = this.userForm.value;
		userData._id = this.user._id;
		
		this.dataService.saveUser(userData)
			.then(user => {
				this.user = user;
				this.toastService.toast("Uloženo.","notice");
			})
			.catch(err => this.toastService.toast("Nastala chyba při ukládání dat.","error"));
	}

}