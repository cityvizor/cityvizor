import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { DataService } 		from '../../services/data.service';
import { UserService } 		from '../../services/user.service';

import { Module, MODULES } from "../../shared/data/modules";

//00006947
@Component({
	moduleId: module.id,
	selector: 'entity-profile',
	templateUrl: 'entity-profile.template.html',
	styleUrls: ['entity-profile.style.css'],
})
export class EntityProfileComponent {

	view: string;
	
	profile: any;
	
	modules: Module[];

	activeModule: Module;
	
	year = 2016;

	constructor(private _route: ActivatedRoute, private _ds: DataService, public userService:UserService) {
		
		this.modules = MODULES;
		
		this._route.params.forEach((params: Params) => {
			if(!this.profile || this.profile.url !== params["id"]) {
				this._ds.getProfile(params["id"]).then(profile => {
					this.profile = profile;
					console.log(profile);
				});
			}
			
			this.modules.some(item => {
				if(item.url === params["view"]){
					this.activeModule = item;
					return true;
				}
			});
			
		});
	}

	isManagedProfile(profile){
		return (profile && this.userService.user.managedProfiles.indexOf(profile._id) >= 0)
	}
	
	getVizLink(viz){
		return ['/profil/' + this.profile.url + '/' + viz.url];
	}
	
	getAdminLink(){
		return ['/profil/' + this.profile.url + '/admin'];
	}
}