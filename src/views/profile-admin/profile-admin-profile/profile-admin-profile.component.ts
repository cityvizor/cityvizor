import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ToastService } from "../../../services/toast.service";

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
	save:EventEmitter<any> = new EventEmitter();

	constructor(private toastService:ToastService) {
	}
	 
	 getEntityString(){
		 if(!this.profile.entity) return "N/A";
		 var info = {
			 "PSČ": this.profile.entity.address ? this.profile.entity.address.postalCode : "",
			 "ZÚJ": this.profile.entity._id,
			 "IČO": this.profile.entity.ico
		 };
		 
		 var ids = Object.keys(info).map(key => key + ": " + info[key]).join(", ");
		 
		 return this.profile.entity.name + " (" + ids + ")";
	 }
	 
	saveProfile(form){
		
		if(form.valid){	
			
			var profileData = form.value;
			profileData._id = this.profile._id;
			
			this.save.emit(profileData);
		}
		else{
			this.toastService.toast("Formulář není správně vyplněn.","error");
		}
	}

}