import { Component, Input } from '@angular/core';

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

	constructor() {
	}
	 
	 getEntityString(){
		 if(!this.profile.entity) return "N/A";
		 return this.profile.entity.name + " (ZÚJ: " + this.profile.entity._id + ", IČO: " + this.profile.entity.ico + ")";
	 }

}