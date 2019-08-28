import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { DataService } 		from 'app/services/data.service';
import { ToastService } 		from 'app/services/toast.service';

import { Profile } from "app/schema/profile";

@Component({
	selector: 'site-admin-profile',
	templateUrl: 'site-admin-profile.component.html',
	styleUrls: ['site-admin-profile.component.scss']
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
		const confirmation = window.confirm("Opravdu chcete smazat profil " + this.profile.name + "?");

		if(confirmation) this.delete.emit(this.profile.id);
	}
	 
	saveProfile(form){
		if(form.valid){
			
			let profileData = form.value;
			
			profileData.id = this.profile.id;
			
			this.save.emit(profileData)
		}
		else{
			this.toastService.toast("Formulář není správně vyplněn.","error");
		}
	}

}