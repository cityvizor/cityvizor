import { Component, Input } from '@angular/core';

//00006947
@Component({
	moduleId: module.id,
	selector: 'entity-admin-profile',
	templateUrl: 'entity-admin-profile.template.html',
	styleUrls: ['entity-admin-profile.style.css']
})
export class EntityAdminProfileComponent {

  @Input()
	profile: any;

	constructor() {
	}
	 
	 getEntityString(){
		 if(!this.profile.entity) return "N/A";
		 return this.profile.entity.name + " (ZÚJ: " + this.profile.entity._id + ", IČO: " + this.profile.entity.ico + ")";
	 }

}