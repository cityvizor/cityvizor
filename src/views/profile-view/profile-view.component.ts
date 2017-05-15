import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { DataService } 		from '../../services/data.service';
import { UserService } 		from '../../services/user.service';

import { Module, MODULES } from "../../shared/data/modules";

//00006947
@Component({
	moduleId: module.id,
	selector: 'profile-view',
	templateUrl: 'profile-view.template.html',
	styleUrls: ['profile-view.style.css'],
})
export class ProfileViewComponent implements OnInit, OnDestroy {

	profile: any;
	
	modules: Module[];

	activeModule: Module;
	
	year = 2016;

	paramsSubscription:Subscription

	constructor(private route: ActivatedRoute, private dataService: DataService, public userService:UserService) {
		
		this.modules = MODULES;	
		
	}

	ngOnInit(){
		this.paramsSubscription = this.route.params.subscribe((params: Params) => {
			if(!this.profile || this.profile.url !== params["profile"]) {
				this.dataService.getProfile(params["profile"]).then(profile => {
					this.profile = profile;
				});
			}

			this.modules.some(item => {
				if(item.url === params["module"]){
					this.activeModule = item;
					return true;
				}
			});

		});
	}

	ngOnDestroy(){
		this.paramsSubscription.unsubscribe();
	}
		
	getMenuConfig(profile){
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
			menu: this.modules.filter(item => this.profile.hiddenModules.indexOf(item.id) < 0).map(item => this.getModuleMenuItem(item)),
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