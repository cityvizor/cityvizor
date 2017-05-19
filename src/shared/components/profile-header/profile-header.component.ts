import { Component, Input } from '@angular/core';

import { AuthService } 		from '../../../services/auth.service';

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
	 
	constructor(public authService:AuthService) {}

	isHiddenModule(viz){
		return this.profile.hiddenModules && this.profile.hiddenModules.indexOf(viz.id) >= 0;
	}

	isManagedProfile(){
		return this.authService.acl("profile-admin",{profile:this.profile._id});
	}

}