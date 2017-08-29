import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ToastService } from "../../../services/toast.service";
import { DataService } 		from '../../../services/data.service';

import { AppConfig } from '../../../config/app-config';

//00006947
@Component({
	moduleId: module.id,
	selector: 'profile-admin-profile',
	templateUrl: 'profile-admin-profile.template.html',
	styleUrls: ['profile-admin-profile.style.css']
})
export class ProfileAdminProfileComponent {

  @Input()
	profile: any;
	 
	@Output()
	saved:EventEmitter<any> = new EventEmitter();
	
	config:any = AppConfig;

	constructor(private toastService:ToastService, private dataService:DataService) {
	}
	 
	save(form){
		
		if(form.valid){	
			
			var profileData = form.value;
			
			profileData._id = this.profile._id;
			
			profileData.gps = [profileData.gps0, profileData.gps1];
			delete profileData.gps0;
			delete profileData.gps1;
			
			this.dataService.saveProfile(profileData)
				.then(profile => {
					this.toastService.toast("Uloženo.", "notice");
					this.saved.emit(profile);
				})
				.catch(err => this.toastService.toast("Nastala neznámá chyba při ukládání profilu.", "error"));
			
		}
		else{
			this.toastService.toast("Formulář není správně vyplněn.","error");
		}
	}

}