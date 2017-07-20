import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { DataService } 		from '../../../services/data.service';
import { ToastService } 		from '../../../services/toast.service';

import { Profile } from "../../../shared/schema/profile";
import { Entity } from "../../../shared/schema/entity";

//00006947
@Component({
	moduleId: module.id,
	selector: 'site-admin-profile',
	templateUrl: 'site-admin-profile.template.html',
	styleUrls: ['site-admin-profile.style.css']
})
export class SiteAdminProfileComponent {
  
	@Input()
	profile:Profile;
	 
	@Output()
	save:EventEmitter<any> = new EventEmitter;
	 
	@Output()
	delete:EventEmitter<any> = new EventEmitter;
	 
	@Output()
	close:EventEmitter<any> = new EventEmitter;

	constructor(private dataService: DataService, private toastService: ToastService) {
	}
	 
	deleteProfile(){
		window.alert("Profil může smazat pouze admin v databázi. To je proto, aby nikdo nesmazal profil omylem.");

		//if(confirmation) this.delete.emit(this.profile._id);
	}
	 
	saveProfile(form){
		if(form.valid){
			
			let profileData = form.value;
			
			profileData._id = this.profile._id;
			
			profileData.gps = [profileData.gps0, profileData.gps1];
			delete profileData.gps0;
			delete profileData.gps1;
			
			this.save.emit(profileData)
		}
		else{
			this.toastService.toast("Formulář není správně vyplněn.","error");
		}
	}

}