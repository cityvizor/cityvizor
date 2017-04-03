import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ToastService } 		from '../../../services/toast.service';
import { DataService } 		from '../../../services/data.service';

import { Module, MODULES } from "../../../shared/data/modules";

@Component({
	moduleId: module.id,
	selector: 'entity-admin-modules',
	templateUrl: 'entity-admin-modules.template.html',
	styles: [],
})
export class EntityAdminModulesComponent {

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
		
		var oldModules = this.profile.modules;
		
		this.dataService.saveProfile(this.profile)
			.then(profile => {
				this.toastService.toast("Uloženo.", "notice");
			})
			.catch((err) => {
				this.profile.module = oldModules;
				this.toastService.toast("Nastala chyba při ukládání","error");
			});
	}

}