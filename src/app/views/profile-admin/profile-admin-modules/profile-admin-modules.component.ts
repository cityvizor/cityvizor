import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';

import { ToastService } 		from 'app/services/toast.service';
import { DataService } 		from 'app/services/data.service';

import { AppConfig, IAppConfig, Module } from 'config/config';

@Component({
	moduleId: module.id,
	selector: 'profile-admin-modules',
	templateUrl: 'profile-admin-modules.component.html',
	styles: [],
})
export class ProfileAdminModulesComponent {

	@Input()
	profile: any;

	modules: Module[];

	constructor(private dataService: DataService, private toastService: ToastService, @Inject(AppConfig) config: IAppConfig) {
		this.modules = config.modules;
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
				this.toastService.toast("Uloženo", "check");
			})
			.catch((err) => {
				this.profile.hiddenModules = oldModules;
				this.toastService.toast("Nastala chyba při ukládání","error");
			});
	}

}