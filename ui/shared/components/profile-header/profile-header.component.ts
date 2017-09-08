import { Component, Input } from '@angular/core';

import { ACLService } 		from '../../../services/acl.service';

import { Module, MODULES } from "../../../shared/data/modules";

//00006947
@Component({
	moduleId: module.id,
	selector: 'profile-header',
	templateUrl: 'profile-header.template.html',
	styleUrls: ['profile-header.style.css']
})
export class ProfileHeaderComponent {

	@Input()
  profile:any;
	 
	vizModules:Module[] = MODULES;
	 
	public isMenuCollapsed: boolean = true;
	 
	constructor(public aclService:ACLService) {}

	isHiddenModule(viz){
		return this.profile.hiddenModules && this.profile.hiddenModules.indexOf(viz.id) >= 0;
	}
	
	getAdminLink(){
		return '/' + this.profile.url + '/admin';
	}
	
	isAdmin(){
		return this.aclService.checkRoute(this.getAdminLink(),{profile:this.profile._id})
	}

}