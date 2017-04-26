import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ToastService } 		from '../../../services/toast.service';
import { DataService } 		from '../../../services/data.service';

import { Module, MODULES } from "../../../shared/data/modules";

@Component({
	moduleId: module.id,
	selector: 'profile-admin-modules',
	templateUrl: 'profile-admin-modules.template.html',
	styles: [],
})
export class ProfileAdminModulesComponent {

	@Input()
	profile: any;

	modules: Module[];

	constructor(private dataService: DataService, private toastService: ToastService) {
		this.modules = MODULES;
	}
	 
	isHiddenModule(viz: Module):boolean{ 
		return (viz.optional && this.profile && this.profile.hiddenModules && this.profile.hiddenModules.indexOf(viz.id) >= 0);
	}

	hideModule(viz: Module){
		 if(this.profile.hiddenModules.indexOf(viz.id) < 0){
			 this.profile.hiddenModules.push(viz.id);
			 this.save();
		 }
	}	
	 
	unhideModule(viz: Module){
		if(this.profile.hiddenModules.indexOf(viz.id) >= 0){
			this.profile.hiddenModules.splice(this.profile.hiddenModules.indexOf(viz.id),1);
			this.save();
		}
	}	
	
	save(){
		
		var oldModules = this.profile.hiddenModules;
		
		var profileData = {_id:this.profile._id,hiddenModules:this.profile.hiddenModules};
		
		this.dataService.saveProfile(profileData)
			.then(profile => {
				this.toastService.toast("Uloženo.", "notice");
			})
			.catch((err) => {
				this.profile.hiddenModules = oldModules;
				this.toastService.toast("Nastala chyba při ukládání","error");
			});
	}

}