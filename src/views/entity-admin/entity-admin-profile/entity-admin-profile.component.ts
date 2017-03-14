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

}