import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';

import { UserService } 		from '../../../services/user.service';
import { DataService } 		from '../../../services/data.service';
import { ToastService } 		from '../../../services/toast.service';

import { User } from "../../../shared/schema/user";

//00006947
@Component({
	moduleId: module.id,
	selector: 'service-desk-account',
	templateUrl: 'service-desk-account.template.html',
	styleUrls: ['service-desk-account.style.css']
})
export class ServiceDeskAccountComponent implements OnInit {

 	@ViewChild('userForm') userForm: NgForm;

  @ViewChild('userPassForm') userPassForm: NgForm;

  user:User;

	constructor(private userService:UserService, private dataService: DataService, private toastService: ToastService) {
	}
   
  ngOnInit(){
    this.loadUser();
  }
	 
  loadUser(){
    this.dataService.getUser(this.userService.user._id)
      .then(user => this.user = user);
  }
   
	saveUser(){
		var userData = this.userForm.value;
		userData._id = this.user._id;
	}

}