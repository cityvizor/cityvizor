import { Component, trigger, state, style, transition, animate } from '@angular/core';
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
	animations: [
		trigger('switchAnimation', [
			transition(':enter', [
				style({opacity: 0}),
				animate("200ms", style({opacity: 1}))
			]),
			transition(':leave', [
				animate("200ms", style({opacity: 0}))
			])
		])
	]
})
export class EntityProfileComponent {

	profile: any;
	
	modules: Module[];

	activeModule: Module;
	
	year = 2016;

	constructor(private route: ActivatedRoute, private dataService: DataService, public userService:UserService) {
		
		this.modules = MODULES;
		
	}

	ngOnInit(){
		this.route.params.forEach((params: Params) => {
			if(!this.profile || this.profile.url !== params["profile"]) {
				this.dataService.getProfile(params["profile"]).then(profile => {
					this.profile = profile;
				});
			}

			console.log(params);

			this.modules.some(item => {
				if(item.url === params["module"]){
					this.activeModule = item;
					return true;
				}
			});

		});
	}

}