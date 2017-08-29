import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { DataService } 		from '../../services/data.service';

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

	constructor(private route: ActivatedRoute, private dataService: DataService) {
		
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
	
	getModuleMenuItem(viz){
		return {
			text: viz.name,
			link: ["/profil/" + this.profile.url + "/" + viz.url]
		};
	}

}