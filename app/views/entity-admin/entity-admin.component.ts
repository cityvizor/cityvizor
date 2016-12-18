import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ToastService } 		from '../../services/toast.service';
import { DataService } 		from '../../services/data.service';

import { Module } from "../../shared/schema";
import { MODULES } from "../../shared/modules";


@Component({
	moduleId: module.id,
	selector: 'entity-admin',
	templateUrl: 'entity-admin.template.html',
	styleUrls: ['entity-admin.style.css'],
})
export class EntityAdminComponent {

	profile: any;	 

	view: string; 
	
	dataString: string = "";

	modules: Array<Module>;
	
	year = 2016;

	constructor(private _route: ActivatedRoute, private _router: Router, private _ds: DataService, private _toastService: ToastService) {

		this.modules = MODULES;

		this._route.params.forEach((params: Params) => {
			this.view = params["view"];
			if(!this.profile || (this.profile && this.profile._id !== params["id"])){
				this._ds.getProfile(params["id"]).then(profile => {
					this.profile = profile;
				});
			}
		});
		
		setInterval(() => this.refreshDataString(),100);
	}
	
	saveProfile(){
		var oldProfile = JSON.parse(JSON.stringify(this.profile));

		this._ds.saveProfile(this.profile)
			.then((entity) => this._toastService.toast("Uloženo.", "notice"))
			.catch((err) => {
			this.profile = oldProfile;
			this._toastService.toast("Nastala chyba při ukládání","error");
		});
	}
	
	getModuleData(moduleId){
		if(!this.profile.data.modules[moduleId]) this.profile.data.modules[moduleId] = {};
		return this.profile.data.modules[moduleId];
	}

	refreshDataString(){
		this.dataString = JSON.stringify(this.profile,null,2);
	}
	
	getModuleLink(openModule){
		return ['../' + openModule.id];
	}
	
	getCloseLink(openModule){
		return ['/profil/' + this.profile._id];
	}

	openConfig(adminModule){
		this._router.navigate([adminModule.id], { relativeTo: this._route });
	}

	closeConfig(){
		this._router.navigate(['../'], { relativeTo: this._route });
	}

}