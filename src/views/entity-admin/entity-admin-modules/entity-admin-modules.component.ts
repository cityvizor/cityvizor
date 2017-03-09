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
	 
	@Output() save = new EventEmitter();

	modules: Module[];

	constructor(private dataService: DataService, private toastService: ToastService) {
		this.modules = MODULES;
	}

	setModuleState(viz: Module,value: boolean){
		var oldState = this.profile.modules[viz.id];
		
		this.profile.modules[viz.id] = value;
		
		this.dataService.saveProfile(this.profile)
			.then(profile => {
				this.toastService.toast("Uloženo.", "notice");
			})
			.catch((err) => {
				this.profile.modules[viz.id] = oldState;
				this.toastService.toast("Nastala chyba při ukládání","error");
			});
	}	

}