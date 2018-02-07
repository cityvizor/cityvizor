import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';

import { DataService } 		from '../../../services/data.service';
import { ToastService } 		from '../../../services/toast.service';

import { User } from "../../../shared/schema/user";

//00006947
@Component({
	moduleId: module.id,
	selector: 'site-admin-user',
	templateUrl: 'site-admin-user.template.html',
	styleUrls: ['site-admin-user.style.css']
})
export class SiteAdminUserComponent {
  
	@Input()
	user:User;
	 
	@Output()
	save:EventEmitter<any> = new EventEmitter;
	 
	@Output()
	delete:EventEmitter<any> = new EventEmitter;
	 
	@Output()
	close:EventEmitter<any> = new EventEmitter;

 	@ViewChild('userForm') form: NgForm;

	roles:string[] = ["admin","profile-admin","profile-manager"];;

	constructor(private dataService: DataService, private toastService: ToastService) {
	}

	hasRole(role){
		if(!this.user || !this.user.roles) return false;
		return this.user.roles.indexOf(role) >= 0;
	}

	setRole(role,state){
		this.user.roles = this.user.roles.filter(item => item !== role);
		if(state) this.user.roles.push(role);
	}

	addProfile(profileId){
		
		if(!profileId) return;		
		
		//check if profile already in list
		if(this.user.managedProfiles.some(profile => profile._id === profileId)) {
			this.toastService.toast("Tento profil je již v seznamu.","notice");
			return;
		}
		
		//get profile information by ID
		this.dataService.getProfile(profileId)
			.then(profile => this.user.managedProfiles.push(profile))
			.catch(err => {
				if(err.status === 404) this.toastService.toast("Profil s tímto ID nenalezen.","notice");
				else this.toastService.toast("Nastala neznámá chyba při stahování informací o profilu.","error");
			});
	}

	removeProfile(profile){
		this.user.managedProfiles = this.user.managedProfiles.filter(item => item._id !== profile._id);
	}
	 
	setPassword(){
		var password = window.prompt("Zadejte nové heslo:");
		
		if(password) this.save.emit({_id:this.user._id,password:password});
			
	}
	 
	saveUser(){
		var userData = this.form.value;
		userData._id = this.user._id;
		userData.managedProfiles = this.user.managedProfiles.map(profile => profile._id);
		userData.roles = this.user.roles;
		this.save.emit(userData);
	}
	 
	deleteUser(){
		var confirmation = window.confirm("Opravdu chcete smazat uživatele " + this.user._id + "?");

		if(confirmation) this.delete.emit(this.user._id);
	}

}