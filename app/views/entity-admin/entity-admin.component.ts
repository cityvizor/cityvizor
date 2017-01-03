import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ToastService } 		from '../../services/toast.service';
import { DataService } 		from '../../services/data.service';

import { Module, MODULES } from "../../shared/data/modules";


@Component({
	moduleId: module.id,
	selector: 'entity-admin',
	templateUrl: 'entity-admin.template.html',
	styleUrls: ['entity-admin.style.css'],
})
export class EntityAdminComponent {

	profile: any;	 
	oldProfile: any;

	view: string; 
	
	dataString: string = "";

	modules: Array<Module>;
	
	activeModule: Module;
	
	year = 2016;

	constructor(private _route: ActivatedRoute, private _router: Router, private _ds: DataService, private _toastService: ToastService) {

		this.modules = MODULES;

		this._route.params.forEach((params: Params) => {
			
			this.loadProfile(params["id"])
			
			this.activeModule = null;
			
			this.modules.some(item => {
				if(item.url === params["view"]) {
					this.activeModule = item;
					return true;
				}
			});
		});
		
		setInterval(() => this.refreshDataString(),100);
	}

	loadProfile(id){
		if(!this.profile || (this.profile && this.profile._id !== id)){
			this._ds.getProfile(id).then(profile => {
				this.profile = profile;
				this.oldProfile = JSON.parse(JSON.stringify(this.profile));
			});
		}
	}

	saveProfile(){
		var toast = this._toastService.toast("Ukládám...", "notice");
		this._ds.saveProfile(this.profile)
			.then((entity) =>{
				toast.hide();
				this._toastService.toast("Uloženo.", "notice");
				this.oldProfile = JSON.parse(JSON.stringify(this.profile));
			})
			.catch((err) => {
				toast.hide();
				this.profile = JSON.parse(JSON.stringify(this.oldProfile));
				this._toastService.toast("Nastala chyba při ukládání","error");
			});
	}
	
	getModuleData(viz){
		if(!this.profile.data.modules[viz.id]) this.profile.data.modules[viz.id] = {};
		return this.profile.data.modules[viz.id];
	}

	refreshDataString(){
		this.dataString = JSON.stringify(this.profile,null,2);
	}
	
	getModuleLink(openModule){
		return ['../' + openModule.url];
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