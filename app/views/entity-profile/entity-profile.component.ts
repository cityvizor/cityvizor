import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { DataService } 		from '../../services/data.service';
import { Module } from "../../shared/schema";
import { MODULES } from "../../shared/modules";

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
	
	year = 2016;

	constructor(private _route: ActivatedRoute, private _ds: DataService) {
		
		this.modules = MODULES;
		
		this._route.params.forEach((params: Params) => {
			this._ds.getProfile(params["id"]).then(profile => {
				this.profile = profile;
			});
			this.view = params["view"];
		});
	}
	
	getVizLink(viz){
		return ['/profil/' + this.profile._id + '/' + viz];
	}
	
	getAdminLink(){
		return ['/profil/' + this.profile._id + '/admin'];
	}
}