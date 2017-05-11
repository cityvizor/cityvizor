import { Component, Input } from '@angular/core';

import { UserService } 		from '../../../services/user.service';

import { MODULES } from "../../../shared/data/modules";

//00006947
@Component({
	moduleId: module.id,
	selector: 'profile-header',
	template: `<header-menu [config]="getMenuConfig(profile)"></header-menu>`,
})
export class ProfileHeaderComponent {

	@Input()
  profile: any;

	constructor(public userService:UserService) {
	}
		
	getMenuConfig(profile){
    
    if(!profile) return {};
    
		var menuConfig = {
			title: {
				text: profile.name,
				link: ["/profil/" + this.profile.url],
				icon: "fa fa-map-signs"
			},
			titleRight: {
				text: "Vybrat obec",
				link: ["/"],
				icon: "fa fa-chevron-circle-right"
			},
			menu: MODULES.filter(item => this.profile.hiddenModules.indexOf(item.id) < 0).map(item => this.getModuleMenuItem(item)),
			menuRight: []
		};
		
		if(this.userService.acl("profile-admin",{profile:this.profile._id})) menuConfig.menuRight.push({ icon: "fa fa-cog", link: ["/profil/" + this.profile.url + "/admin"] });
		
		return menuConfig;
	}
	
	getModuleMenuItem(viz){
		return {
			text: viz.name,
			link: ["/profil/" + this.profile.url + "/" + viz.url]
		};
	}


}