import { Component, Input } from '@angular/core';

import { Module, MODULES } from "../../data/modules";

import { UserService } 		from '../../../services/user.service';

//00006947
@Component({
	moduleId: module.id,
	selector: 'profile-header',
	templateUrl: 'profile-header.template.html',
	styleUrls: ['profile-header.style.css']
})
export class ProfileHeaderComponent {

  @Input()
	profile: any;

	modules:Module[];
	 
	 
	public isMenuCollapsed: boolean = true;

	constructor(private userService:UserService) {
		this.modules = MODULES;
	}
	 
	getActiveModules(){
		if(!this.profile || !this.profile.hiddenModules) return this.modules;
		return this.modules.filter(item => this.profile.hiddenModules.indexOf(item.id) < 0);
	}

	isManagedProfile(){
		return (this.profile && this.userService.user.managedProfiles.indexOf(this.profile._id) >= 0);
	}
	 
	getVizLink(viz){
		return ['/profil/' + this.profile.url + '/' + viz.url];
	}
	 
	getHomeLink(){
		return ['/profil/' + this.profile.url];
	}
	
	getAdminLink(){
		return ['/profil/' + this.profile.url + '/admin'];
	}
}